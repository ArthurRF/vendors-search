import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { BasicAuthGuard } from 'src/common/guards/basic-auth.guard';
import { JobService } from '../services/job.service';
import { CreateJobDTO } from '../types/job.dtos';

@Controller('/job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @UseGuards(BasicAuthGuard)
  @Post('/create')
  createJob(@Body() { location, name, serviceCategory }: CreateJobDTO) {
    return this.jobService.createJob({ name, serviceCategory, location });
  }
}
