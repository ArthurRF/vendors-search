import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BasicAuthGuard } from 'src/common/guards/basic-auth.guard';
import { VendorService } from '../services/vendor.service';
import { CreateVendorDTO, GetVendorsSummaryDTO } from '../types/vendor.dtos';

@Controller('/vendor')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @UseGuards(BasicAuthGuard)
  @Post('/create')
  createVendor(@Body() { name, services, location }: CreateVendorDTO) {
    return this.vendorService.createVendor({ name, services, location });
  }

  @UseGuards(BasicAuthGuard)
  @Get('/potentials')
  getPotentialVendors(@Query('jobId', ParseIntPipe) jobId: number) {
    return this.vendorService.getPotentialVendors(jobId);
  }

  @Get('/summary')
  getVendorsSummary(@Query() { service, location }: GetVendorsSummaryDTO) {
    return this.vendorService.getVendorsSummary({ service, location });
  }
}
