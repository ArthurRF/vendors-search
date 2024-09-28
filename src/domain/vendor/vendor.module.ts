import { Module } from '@nestjs/common';
import { JobModule } from '../job/job.module';
import { LocationRepository } from '../location/repositories/location.repository';
import { ServiceCategoryRepository } from '../serviceCategory/repositories/serviceCategory.repository';
import { VendorController } from './controllers/vendor.controller';
import { VendorRepository } from './repositories/vendor.repository';
import { VendorService } from './services/vendor.service';

@Module({
  imports: [JobModule],
  providers: [
    VendorService,
    VendorRepository,
    LocationRepository,
    ServiceCategoryRepository,
  ],
  controllers: [VendorController],
  exports: [VendorRepository],
})
export class VendorModule {}
