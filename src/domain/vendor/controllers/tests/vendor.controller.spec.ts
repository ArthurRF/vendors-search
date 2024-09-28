import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { VendorService } from '../../services/vendor.service';
import { CreateVendorDTO, GetVendorsSummaryDTO } from '../../types/vendor.dtos';
import { VendorController } from '../vendor.controller';

describe('VendorController', () => {
  let vendorController: VendorController;
  let vendorService: VendorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VendorController],
      providers: [
        {
          provide: VendorService,
          useValue: {
            createVendor: jest.fn(),
            getPotentialVendors: jest.fn(),
            getVendorsSummary: jest.fn(),
          },
        },
      ],
    }).compile();

    vendorController = module.get<VendorController>(VendorController);
    vendorService = module.get<VendorService>(VendorService);
  });

  describe('createVendor', () => {
    it('should create a vendor successfully', async () => {
      const createVendorDto: CreateVendorDTO = {
        name: 'Vendor A',
        services: [{ name: 'Landscaping', compliant: true }],
        location: 'Fayette TX',
      };

      const expectedResponse = {
        id: 1,
        name: 'Vendor A',
        services: [{ id: 1, compliant: true }],
        locationId: 1,
      };

      jest
        .spyOn(vendorService, 'createVendor')
        .mockResolvedValue(expectedResponse as never);

      const response = await vendorController.createVendor(createVendorDto);

      expect(response).toEqual(expectedResponse);
      expect(vendorService.createVendor).toHaveBeenCalledWith(createVendorDto);
    });

    it('should throw BadRequestException if location is not found', async () => {
      const createVendorDto: CreateVendorDTO = {
        name: 'Vendor B',
        services: [{ name: 'Nonexistent Service', compliant: false }],
        location: 'Invalid Location',
      };

      jest.spyOn(vendorService, 'createVendor').mockImplementation(() => {
        throw new BadRequestException('Location not found');
      });

      try {
        vendorController.createVendor(createVendorDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Location not found');
      }
    });
  });

  describe('getPotentialVendors', () => {
    it('should return potential vendors for a given jobId', async () => {
      const jobId = 1;
      const expectedVendors = ['Vendor A', 'Vendor B'];

      jest
        .spyOn(vendorService, 'getPotentialVendors')
        .mockResolvedValue(expectedVendors as never);

      const response = await vendorController.getPotentialVendors(jobId);

      expect(response).toEqual(expectedVendors);
      expect(vendorService.getPotentialVendors).toHaveBeenCalledWith(jobId);
    });
  });

  describe('getVendorsSummary', () => {
    it('should return a summary of vendors for a given location and service', async () => {
      const getVendorsSummaryDto: GetVendorsSummaryDTO = {
        location: 'Fayette TX',
        service: 'Landscaping',
      };

      const expectedSummary = {
        total: 3,
        compliant: 2,
        'not compliant': 1,
      };

      jest
        .spyOn(vendorService, 'getVendorsSummary')
        .mockResolvedValue(expectedSummary as never);

      const response =
        await vendorController.getVendorsSummary(getVendorsSummaryDto);

      expect(response).toEqual(expectedSummary);
      expect(vendorService.getVendorsSummary).toHaveBeenCalledWith(
        getVendorsSummaryDto,
      );
    });

    it('should throw BadRequestException if location is not found', async () => {
      const getVendorsSummaryDto: GetVendorsSummaryDTO = {
        location: 'Invalid Location',
        service: 'Landscaping',
      };

      jest.spyOn(vendorService, 'getVendorsSummary').mockImplementation(() => {
        throw new BadRequestException('Location not found');
      });

      try {
        vendorController.getVendorsSummary(getVendorsSummaryDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Location not found');
      }
    });

    it('should throw BadRequestException if service category is not found', async () => {
      const getVendorsSummaryDto: GetVendorsSummaryDTO = {
        location: 'Fayette TX',
        service: 'Invalid Service',
      };

      jest.spyOn(vendorService, 'getVendorsSummary').mockImplementation(() => {
        throw new BadRequestException('Service category not found');
      });

      try {
        vendorController.getVendorsSummary(getVendorsSummaryDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Service category not found');
      }
    });
  });
});
