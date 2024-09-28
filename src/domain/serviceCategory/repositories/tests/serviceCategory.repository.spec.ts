import { ServiceCategoryRepository } from '../../repositories/serviceCategory.repository';
import { IServiceCategory } from '../../types/serviceCategory.interfaces';

describe('ServiceCategoryRepository', () => {
  let serviceCategoryRepository: ServiceCategoryRepository;

  beforeEach(() => {
    serviceCategoryRepository = new ServiceCategoryRepository();
  });

  it('should find a service category by name', () => {
    const categoryName = 'Air Conditioning';
    const expectedCategory: IServiceCategory = {
      id: 2,
      name: 'Air Conditioning',
    };

    const foundCategory = serviceCategoryRepository.getByName(categoryName);

    expect(foundCategory).toEqual(expectedCategory);
  });

  it('should return undefined if service category does not exist', () => {
    const categoryName = 'Invalid Category';
    const foundCategory = serviceCategoryRepository.getByName(categoryName);

    expect(foundCategory).toBeUndefined();
  });

  it('should find the correct service category ignoring case sensitivity', () => {
    const categoryName = 'Landscaping Maintenance';
    const expectedCategory: IServiceCategory = {
      id: 4,
      name: 'Landscaping Maintenance',
    };

    const foundCategory = serviceCategoryRepository.getByName(categoryName);

    expect(foundCategory).toEqual(expectedCategory);
  });
});
