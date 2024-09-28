import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BasicAuthGuard } from 'src/common/guards/basic-auth.guard';
import { JobService } from '../../services/job.service';
import { CreateJobDTO } from '../../types/job.dtos';
import { IJob } from '../../types/job.interfaces';
import { JobController } from '../job.controller';

describe('JobController', () => {
  let jobController: JobController;
  let jobService: JobService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobController],
      providers: [
        {
          provide: JobService,
          useValue: {
            createJob: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(BasicAuthGuard)
      .useValue({})
      .compile();

    jobController = module.get<JobController>(JobController);
    jobService = module.get<JobService>(JobService);
  });

  it('should create a job successfully', async () => {
    const createJobDto: CreateJobDTO = {
      location: 'Fayette TX',
      name: 'Landscaping Maintenance',
      serviceCategory: 'Landscaping Maintenance',
    };

    const result: IJob = {
      id: 1,
      name: 'Landscaping Maintenance',
      serviceCategoryId: 1,
      locationId: 1,
    };

    jest.spyOn(jobService, 'createJob').mockResolvedValue(result as never);

    const response = await jobController.createJob(createJobDto);

    expect(response).toEqual(result);
    expect(jobService.createJob).toHaveBeenCalledWith(createJobDto);
  });

  it('should throw BadRequestException if service category is invalid', async () => {
    const createJobDto: CreateJobDTO = {
      location: 'Fayette TX',
      name: 'Invalid Service Job',
      serviceCategory: 'Invalid Service',
    };

    jest.spyOn(jobService, 'createJob').mockImplementation(() => {
      throw new BadRequestException('Service category not found');
    });

    try {
      jobController.createJob(createJobDto);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe('Service category not found');
    }
  });
});
