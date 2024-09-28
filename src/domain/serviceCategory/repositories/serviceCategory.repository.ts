import { Injectable } from '@nestjs/common';
import { IServiceCategory } from '../types/serviceCategory.interfaces';

@Injectable()
export class ServiceCategoryRepository {
  private serviceCategories: IServiceCategory[] = [
    {
      id: 1,
      name: 'Access Control Software',
    },
    {
      id: 2,
      name: 'Air Conditioning',
    },
    {
      id: 3,
      name: 'Landscaping',
    },
    {
      id: 4,
      name: 'Landscaping Maintenance',
    },
    {
      id: 5,
      name: 'Snow and Ice Removal',
    },
    {
      id: 6,
      name: 'Sewer and Water Pipelining',
    },
  ];

  getByName(name: string): IServiceCategory | undefined {
    return this.serviceCategories.find(
      (serviceCategory) =>
        serviceCategory.name.toLowerCase() === name.toLowerCase(),
    );
  }
}
