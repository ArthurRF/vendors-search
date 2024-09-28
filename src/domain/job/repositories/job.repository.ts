import { Injectable } from '@nestjs/common';
import { IJob } from '../types/job.interfaces';

interface ICreateJobRepoParams {
  name: string;
  serviceCategoryId: number;
  locationId: number;
}

@Injectable()
export class JobRepository {
  private jobs: IJob[] = [];
  private jobIdCounter = 1;

  createJob({
    locationId,
    name,
    serviceCategoryId,
  }: ICreateJobRepoParams): IJob {
    const newJob = {
      id: this.jobIdCounter++,
      name,
      serviceCategoryId,
      locationId,
    };
    this.jobs.push(newJob);
    return newJob;
  }

  getJobById(jobId: number): IJob | undefined {
    return this.jobs.find((job) => job.id === jobId);
  }
}
