import { Module } from '@nestjs/common';
import { LocationRepository } from '../location/repositories/location.repository';
import { ServiceCategoryRepository } from '../serviceCategory/repositories/serviceCategory.repository';
import { JobController } from './controllers/job.controller';
import { JobRepository } from './repositories/job.repository';
import { JobService } from './services/job.service';

@Module({
  providers: [
    JobService,
    JobRepository,
    LocationRepository,
    ServiceCategoryRepository,
  ],
  controllers: [JobController],
  exports: [JobService, JobRepository],
})
export class JobModule {}
