import { JobRepository } from '../job.repository';

describe('JobRepository', () => {
  let jobRepository: JobRepository;

  beforeEach(() => {
    jobRepository = new JobRepository();
  });

  it('should create a new job successfully', () => {
    const jobParams = {
      name: 'Landscaping Maintenance',
      serviceCategoryId: 1,
      locationId: 1,
    };

    const newJob = jobRepository.createJob(jobParams);

    expect(newJob).toBeDefined();
    expect(newJob.id).toBe(1);
    expect(newJob.name).toBe('Landscaping Maintenance');
    expect(newJob.serviceCategoryId).toBe(1);
    expect(newJob.locationId).toBe(1);
  });

  it('should create multiple jobs with incrementing ids', () => {
    const jobParams1 = {
      name: 'Landscaping Maintenance',
      serviceCategoryId: 1,
      locationId: 1,
    };

    const jobParams2 = {
      name: 'Air Conditioning',
      serviceCategoryId: 2,
      locationId: 2,
    };

    const job1 = jobRepository.createJob(jobParams1);
    const job2 = jobRepository.createJob(jobParams2);

    expect(job1.id).toBe(1);
    expect(job2.id).toBe(2);
  });

  it('should retrieve a job by id', () => {
    const jobParams = {
      name: 'Air Conditioning',
      serviceCategoryId: 2,
      locationId: 2,
    };

    const createdJob = jobRepository.createJob(jobParams);
    const foundJob = jobRepository.getJobById(createdJob.id);

    expect(foundJob).toBeDefined();
    expect(foundJob?.id).toBe(createdJob.id);
    expect(foundJob?.name).toBe('Air Conditioning');
    expect(foundJob?.serviceCategoryId).toBe(2);
    expect(foundJob?.locationId).toBe(2);
  });

  it('should return undefined if job with given id does not exist', () => {
    const result = jobRepository.getJobById(999);
    expect(result).toBeUndefined();
  });
});
