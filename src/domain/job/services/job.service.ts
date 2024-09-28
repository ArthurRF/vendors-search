import { BadRequestException, Injectable } from '@nestjs/common';
import { LocationRepository } from 'src/domain/location/repositories/location.repository';
import { ServiceCategoryRepository } from 'src/domain/serviceCategory/repositories/serviceCategory.repository';
import { JobRepository } from '../repositories/job.repository';

interface ICreateJobParams {
  name: string;
  serviceCategory: string;
  location: string;
}

@Injectable()
export class JobService {
  constructor(
    private readonly jobRepository: JobRepository,
    private readonly locationRepository: LocationRepository,
    private readonly serviceCategoryRepository: ServiceCategoryRepository,
  ) {}

  createJob({ location, name, serviceCategory }: ICreateJobParams) {
    const locationFound = this.locationRepository.getByName(location);
    if (!locationFound) {
      throw new BadRequestException('Location not found');
    }

    const serviceCategoryFound =
      this.serviceCategoryRepository.getByName(serviceCategory);
    if (!serviceCategoryFound) {
      throw new BadRequestException('Service category not found');
    }

    return this.jobRepository.createJob({
      name,
      serviceCategoryId: serviceCategoryFound.id,
      locationId: locationFound.id,
    });
  }
}
