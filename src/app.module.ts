import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JobModule } from './domain/job/job.module';
import { VendorModule } from './domain/vendor/vendor.module';

ConfigModule.forRoot();

@Module({
  imports: [VendorModule, JobModule],
})
export class AppModule {}
