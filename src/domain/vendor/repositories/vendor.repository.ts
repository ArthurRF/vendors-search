import { Injectable } from '@nestjs/common';
import { IVendor } from '../types/vendor.interfaces';

interface ICreateVendorRepoParams {
  name: string;
  serviceCategories: { id: number; compliant: boolean }[];
  locationId: number;
}

@Injectable()
export class VendorRepository {
  private vendors: IVendor[] = [];
  private vendorIdCounter = 1;

  createVendor({
    locationId,
    name,
    serviceCategories,
  }: ICreateVendorRepoParams): IVendor {
    const newVendor = {
      id: this.vendorIdCounter++,
      name,
      serviceCategories,
      locationId,
    };
    this.vendors.push(newVendor);
    return newVendor;
  }

  getAllVendors(): IVendor[] {
    return this.vendors;
  }

  getByLocationAndService(
    locationId: number,
    serviceCategoryId: number,
  ): IVendor[] {
    return this.vendors.filter((v) => {
      return (
        v.locationId === locationId &&
        v.serviceCategories.find((sc) => sc.id === serviceCategoryId)
      );
    });
  }
}
