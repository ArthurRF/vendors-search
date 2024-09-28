import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JobRepository } from '../../../job/repositories/job.repository';
import { LocationRepository } from '../../../location/repositories/location.repository';
import { ServiceCategoryRepository } from '../../../serviceCategory/repositories/serviceCategory.repository';
import { VendorRepository } from '../../repositories/vendor.repository';
import { VendorService } from '../../services/vendor.service';

describe('VendorService', () => {
  let vendorService: VendorService;
  let vendorRepository: VendorRepository;
  let locationRepository: LocationRepository;
  let serviceCategoryRepository: ServiceCategoryRepository;
  let jobRepository: JobRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VendorService,
        {
          provide: VendorRepository,
          useValue: {
            createVendor: jest.fn(),
            getAllVendors: jest.fn(),
            getByLocationAndService: jest.fn(),
          },
        },
        {
          provide: LocationRepository,
          useValue: {
            getByName: jest.fn(),
          },
        },
        {
          provide: ServiceCategoryRepository,
          useValue: {
            getByName: jest.fn(),
          },
        },
        {
          provide: JobRepository,
          useValue: {
            getJobById: jest.fn(),
          },
        },
      ],
    }).compile();

    vendorService = module.get<VendorService>(VendorService);
    vendorRepository = module.get<VendorRepository>(VendorRepository);
    locationRepository = module.get<LocationRepository>(LocationRepository);
    serviceCategoryRepository = module.get<ServiceCategoryRepository>(
      ServiceCategoryRepository,
    );
    jobRepository = module.get<JobRepository>(JobRepository);
  });

  describe('createVendor', () => {
    it('should create a vendor successfully', () => {
      const location = 'Fayette TX';
      const name = 'Vendor A';
      const services = [{ name: 'Landscaping', compliant: true }];

      const locationFound = { id: 10, name: 'Fayette', state: 'TX' };
      const serviceCategoryFound = { id: 3, name: 'Landscaping' };

      locationRepository.getByName = jest.fn().mockReturnValue(locationFound);
      serviceCategoryRepository.getByName = jest
        .fn()
        .mockReturnValue(serviceCategoryFound);
      vendorRepository.createVendor = jest.fn().mockReturnValue({
        id: 1,
        name,
        serviceCategories: [{ id: 3, compliant: true }],
        locationId: locationFound.id,
      });

      const result = vendorService.createVendor({ location, name, services });

      expect(result).toEqual({
        id: 1,
        name,
        serviceCategories: [{ id: 3, compliant: true }],
        locationId: locationFound.id,
      });
      expect(locationRepository.getByName).toHaveBeenCalledWith(location);
      expect(serviceCategoryRepository.getByName).toHaveBeenCalledWith(
        services[0].name,
      );
      expect(vendorRepository.createVendor).toHaveBeenCalled();
    });

    it('should throw BadRequestException if location is not found', () => {
      const location = 'Invalid Location';
      const name = 'Vendor A';
      const services = [{ name: 'Landscaping', compliant: true }];

      locationRepository.getByName = jest.fn().mockReturnValue(undefined);

      expect(() =>
        vendorService.createVendor({ location, name, services }),
      ).toThrow(BadRequestException);
      expect(() =>
        vendorService.createVendor({ location, name, services }),
      ).toThrow('Location not found');
    });

    it('should throw BadRequestException if service category is not found', () => {
      const location = 'Fayette TX';
      const name = 'Vendor A';
      const services = [{ name: 'Invalid Service', compliant: true }];

      const locationFound = { id: 10, name: 'Fayette', state: 'TX' };
      locationRepository.getByName = jest.fn().mockReturnValue(locationFound);
      serviceCategoryRepository.getByName = jest
        .fn()
        .mockReturnValue(undefined);

      expect(() =>
        vendorService.createVendor({ location, name, services }),
      ).toThrow(BadRequestException);
      expect(() =>
        vendorService.createVendor({ location, name, services }),
      ).toThrow('Service category not found');
    });
  });

  describe('getPotentialVendors', () => {
    it('should return an empty array if job is not found', () => {
      const jobId = 1;
      jobRepository.getJobById = jest.fn().mockReturnValue(undefined);

      const result = vendorService.getPotentialVendors(jobId);

      expect(result).toEqual([]);
    });

    it('should return matching vendors based on job criteria', () => {
      const jobId = 1;
      const job = { id: 1, serviceCategoryId: 3, locationId: 10 };
      const vendors = [
        {
          id: 1,
          name: 'Vendor A',
          serviceCategories: [{ id: 3, compliant: true }],
          locationId: 10,
        },
        {
          id: 2,
          name: 'Vendor B',
          serviceCategories: [{ id: 3, compliant: false }],
          locationId: 10,
        },
      ];

      jobRepository.getJobById = jest.fn().mockReturnValue(job);
      vendorRepository.getAllVendors = jest.fn().mockReturnValue(vendors);

      const result = vendorService.getPotentialVendors(jobId);

      expect(result).toEqual(['Vendor A', 'Vendor B']);
    });

    it('should sort vendors based on compliance and name', () => {
      const jobId = 1;
      const job = { id: 1, serviceCategoryId: 3, locationId: 10 };
      const vendors = [
        {
          id: 1,
          name: 'Vendor A',
          serviceCategories: [{ id: 3, compliant: false }],
          locationId: 10,
        },
        {
          id: 2,
          name: 'Vendor B',
          serviceCategories: [{ id: 3, compliant: true }],
          locationId: 10,
        },
      ];

      jobRepository.getJobById = jest.fn().mockReturnValue(job);
      vendorRepository.getAllVendors = jest.fn().mockReturnValue(vendors);

      const result = vendorService.getPotentialVendors(jobId);

      expect(result).toEqual(['Vendor B', 'Vendor A']);
    });
  });

  describe('getVendorsSummary', () => {
    it('should throw BadRequestException if location is not found', () => {
      const location = 'Invalid Location';
      const service = 'Landscaping';

      locationRepository.getByName = jest.fn().mockReturnValue(undefined);

      expect(() =>
        vendorService.getVendorsSummary({ location, service }),
      ).toThrow(BadRequestException);
      expect(() =>
        vendorService.getVendorsSummary({ location, service }),
      ).toThrow('Location not found');
    });

    it('should throw BadRequestException if service category is not found', () => {
      const location = 'Fayette TX';
      const service = 'Invalid Service';

      const locationFound = { id: 10, name: 'Fayette', state: 'TX' };
      locationRepository.getByName = jest.fn().mockReturnValue(locationFound);
      serviceCategoryRepository.getByName = jest
        .fn()
        .mockReturnValue(undefined);

      expect(() =>
        vendorService.getVendorsSummary({ location, service }),
      ).toThrow(BadRequestException);
      expect(() =>
        vendorService.getVendorsSummary({ location, service }),
      ).toThrow('Service category not found');
    });

    it('should return a summary of vendors', () => {
      const location = 'Fayette TX';
      const service = 'Landscaping';
      const locationFound = { id: 10, name: 'Fayette', state: 'TX' };
      const serviceCategoryFound = { id: 3, name: 'Landscaping' };

      locationRepository.getByName = jest.fn().mockReturnValue(locationFound);
      serviceCategoryRepository.getByName = jest
        .fn()
        .mockReturnValue(serviceCategoryFound);
      vendorRepository.getByLocationAndService = jest
        .fn()
        .mockReturnValue([
          { serviceCategories: [{ id: 3, compliant: true }] },
          { serviceCategories: [{ id: 3, compliant: false }] },
        ]);

      const result = vendorService.getVendorsSummary({ location, service });

      expect(result).toEqual({
        total: 2,
        compliant: 1,
        'not compliant': 1,
      });
    });
  });
});
