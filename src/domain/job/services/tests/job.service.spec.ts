import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LocationRepository } from 'src/domain/location/repositories/location.repository';
import { ServiceCategoryRepository } from 'src/domain/serviceCategory/repositories/serviceCategory.repository';
import { JobRepository } from '../../repositories/job.repository';
import { JobService } from '../job.service';

describe('JobService', () => {
  let jobService: JobService;
  let jobRepository: JobRepository;
  let locationRepository: LocationRepository;
  let serviceCategoryRepository: ServiceCategoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobService,
        {
          provide: JobRepository,
          useValue: {
            createJob: jest.fn(),
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
      ],
    }).compile();

    jobService = module.get<JobService>(JobService);
    jobRepository = module.get<JobRepository>(JobRepository);
    locationRepository = module.get<LocationRepository>(LocationRepository);
    serviceCategoryRepository = module.get<ServiceCategoryRepository>(
      ServiceCategoryRepository,
    );
  });

  it('should create a job successfully', async () => {
    const location = { id: 1, name: 'Fayette', state: 'TX' };
    const serviceCategory = { id: 1, name: 'Landscaping Maintenance' };

    jest.spyOn(locationRepository, 'getByName').mockReturnValue(location);
    jest
      .spyOn(serviceCategoryRepository, 'getByName')
      .mockReturnValue(serviceCategory);

    const createJobDto = {
      name: 'Job 1',
      location: 'Fayette TX',
      serviceCategory: 'Landscaping Maintenance',
    };

    await jobService.createJob(createJobDto);

    expect(locationRepository.getByName).toHaveBeenCalledWith('Fayette TX');
    expect(serviceCategoryRepository.getByName).toHaveBeenCalledWith(
      'Landscaping Maintenance',
    );
    expect(jobRepository.createJob).toHaveBeenCalledWith({
      name: 'Job 1',
      locationId: 1,
      serviceCategoryId: 1,
    });
  });

  it('should throw BadRequestException if location is not found', () => {
    jest.spyOn(locationRepository, 'getByName').mockReturnValue(null);

    const createJobDto = {
      name: 'Job 2',
      location: 'Unknown Location',
      serviceCategory: 'Landscaping Maintenance',
    };

    expect(() => jobService.createJob(createJobDto)).toThrow(
      BadRequestException,
    );
    expect(() => jobService.createJob(createJobDto)).toThrow(
      'Location not found',
    );
  });

  it('should throw BadRequestException if service category is not found', () => {
    const location = { id: 1, name: 'New York', state: 'NY' };
    jest.spyOn(locationRepository, 'getByName').mockReturnValue(location);
    jest.spyOn(serviceCategoryRepository, 'getByName').mockReturnValue(null);

    const createJobDto = {
      name: 'Job 3',
      location: 'Fayette TX',
      serviceCategory: 'Unknown Category',
    };

    expect(() => jobService.createJob(createJobDto)).toThrow(
      BadRequestException,
    );
    expect(() => jobService.createJob(createJobDto)).toThrow(
      'Service category not found',
    );
  });
});
