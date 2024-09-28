import { BadRequestException, Injectable } from '@nestjs/common';
import { JobRepository } from '../../job/repositories/job.repository';
import { LocationRepository } from '../../location/repositories/location.repository';
import { ServiceCategoryRepository } from '../../serviceCategory/repositories/serviceCategory.repository';
import { VendorRepository } from '../repositories/vendor.repository';

interface ICreateVendorParams {
  name: string;
  services: { name: string; compliant: boolean }[];
  location: string;
}

interface IGetSummaryParams {
  location: string;
  service: string;
}

@Injectable()
export class VendorService {
  constructor(
    private readonly vendorRepository: VendorRepository,
    private readonly locationRepository: LocationRepository,
    private readonly serviceCategoryRepository: ServiceCategoryRepository,
    private readonly jobRepository: JobRepository,
  ) {}

  createVendor({ location, name, services }: ICreateVendorParams) {
    const locationFound = this.locationRepository.getByName(location);

    if (!locationFound) {
      throw new BadRequestException('Location not found');
    }

    const foundCategories: { id: number; compliant: boolean }[] = [];
    for (const service of services) {
      const serviceCategoryFound = this.serviceCategoryRepository.getByName(
        service.name,
      );
      if (!serviceCategoryFound) {
        throw new BadRequestException('Service category not found');
      }
      foundCategories.push({
        id: serviceCategoryFound.id,
        compliant: service.compliant,
      });
    }

    return this.vendorRepository.createVendor({
      name,
      serviceCategories: foundCategories,
      locationId: locationFound.id,
    });
  }

  getPotentialVendors(jobId: number) {
    const job = this.jobRepository.getJobById(jobId);
    if (!job) return [];

    const matchingVendors = this.vendorRepository
      .getAllVendors()
      .map((v) => {
        return {
          ...v,
          serviceCategories: v.serviceCategories.find(
            (sc) => sc.id === job.serviceCategoryId,
          ),
        };
      })
      .filter((v) => v.locationId === job.locationId && v.serviceCategories)
      .sort((v1, v2) => {
        if (v1.serviceCategories.compliant && !v2.serviceCategories.compliant) {
          return -1;
        }
        if (!v1.serviceCategories.compliant && v2.serviceCategories.compliant) {
          return 1;
        }

        return v1.name.localeCompare(v2.name);
      });

    return matchingVendors.map((mv) => mv.name);
  }

  getVendorsSummary({ location, service }: IGetSummaryParams) {
    const locationFound = this.locationRepository.getByName(location);

    if (!locationFound) {
      throw new BadRequestException('Location not found');
    }

    const serviceCategoryFound =
      this.serviceCategoryRepository.getByName(service);
    if (!serviceCategoryFound) {
      throw new BadRequestException('Service category not found');
    }

    const matchingVendors = this.vendorRepository.getByLocationAndService(
      locationFound.id,
      serviceCategoryFound.id,
    );

    const result = {
      total: 0,
      compliant: 0,
      'not compliant': 0,
    };
    matchingVendors.forEach((v) => {
      if (
        v.serviceCategories.find((sc) => sc.id === serviceCategoryFound.id)
          .compliant
      ) {
        result['compliant'] += 1;
      } else {
        result['not compliant'] += 1;
      }
      result['total'] += 1;
    });

    return result;
  }
}
