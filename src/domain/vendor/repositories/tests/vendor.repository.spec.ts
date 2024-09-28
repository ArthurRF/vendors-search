import { Test, TestingModule } from '@nestjs/testing';
import { VendorRepository } from '../../repositories/vendor.repository';

describe('VendorRepository', () => {
  let vendorRepository: VendorRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VendorRepository],
    }).compile();

    vendorRepository = module.get<VendorRepository>(VendorRepository);
  });

  describe('createVendor', () => {
    it('should create a vendor and return it', () => {
      const locationId = 1;
      const name = 'Vendor A';
      const serviceCategories = [{ id: 1, compliant: true }];

      const result = vendorRepository.createVendor({
        locationId,
        name,
        serviceCategories,
      });

      expect(result).toEqual({
        id: 1,
        name,
        serviceCategories,
        locationId,
      });
      expect(vendorRepository.getAllVendors()).toContainEqual(result);
    });

    it('should increment the vendor ID for each new vendor created', () => {
      const locationId = 1;
      const name1 = 'Vendor A';
      const name2 = 'Vendor B';
      const serviceCategories = [{ id: 1, compliant: true }];

      vendorRepository.createVendor({
        locationId,
        name: name1,
        serviceCategories,
      });

      const secondVendor = vendorRepository.createVendor({
        locationId,
        name: name2,
        serviceCategories,
      });

      expect(secondVendor.id).toBe(2);
    });
  });

  describe('getAllVendors', () => {
    it('should return an empty array initially', () => {
      const result = vendorRepository.getAllVendors();
      expect(result).toEqual([]);
    });

    it('should return all created vendors', () => {
      const locationId = 1;
      const name = 'Vendor A';
      const serviceCategories = [{ id: 1, compliant: true }];

      vendorRepository.createVendor({
        locationId,
        name,
        serviceCategories,
      });

      const vendors = vendorRepository.getAllVendors();
      expect(vendors.length).toBe(1);
      expect(vendors[0].name).toBe(name);
    });
  });

  describe('getByLocationAndService', () => {
    it('should return an empty array if no vendors match the criteria', () => {
      const result = vendorRepository.getByLocationAndService(1, 1);
      expect(result).toEqual([]);
    });

    it('should return vendors that match the given location and service category', () => {
      const locationId = 1;
      const name = 'Vendor A';
      const serviceCategories = [{ id: 1, compliant: true }];

      vendorRepository.createVendor({
        locationId,
        name,
        serviceCategories,
      });

      const matchingVendors = vendorRepository.getByLocationAndService(
        locationId,
        1,
      );
      expect(matchingVendors.length).toBe(1);
      expect(matchingVendors[0].name).toBe(name);
    });

    it('should return vendors only if they match both location and service category', () => {
      const locationId1 = 1;
      const locationId2 = 2;
      const serviceCategories1 = [{ id: 1, compliant: true }];
      const serviceCategories2 = [{ id: 2, compliant: false }];

      vendorRepository.createVendor({
        locationId: locationId1,
        name: 'Vendor A',
        serviceCategories: serviceCategories1,
      });

      vendorRepository.createVendor({
        locationId: locationId2,
        name: 'Vendor B',
        serviceCategories: serviceCategories2,
      });

      const matchingVendors = vendorRepository.getByLocationAndService(
        locationId1,
        1,
      );
      expect(matchingVendors.length).toBe(1);
      expect(matchingVendors[0].name).toBe('Vendor A');

      const nonMatchingVendors = vendorRepository.getByLocationAndService(
        locationId2,
        1,
      );
      expect(nonMatchingVendors.length).toBe(0);
    });
  });
});
