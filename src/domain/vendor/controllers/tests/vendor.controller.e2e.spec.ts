import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';
import { CreateVendorDTO, GetVendorsSummaryDTO } from '../../types/vendor.dtos';

describe('VendorController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/vendor/create (POST)', () => {
    it('should create a vendor successfully', async () => {
      const createVendorDto: CreateVendorDTO = {
        name: 'Test Vendor',
        services: [
          { name: 'Air Conditioning', compliant: true },
          { name: 'Landscaping', compliant: false },
        ],
        location: 'Fayette TX',
      };

      const response = await request(app.getHttpServer())
        .post('/vendor/create')
        .auth(process.env.ADMIN_USER, process.env.ADMIN_PASSWORD)
        .send(createVendorDto)
        .expect(201);

      expect(response.body).toEqual(
        expect.objectContaining({
          name: 'Test Vendor',
          locationId: expect.any(Number),
        }),
      );
    });

    it('should return 401 Unauthorized when no auth is provided', async () => {
      const createVendorDto: CreateVendorDTO = {
        name: 'Unauthorized Vendor',
        services: [{ name: 'Air Conditioning', compliant: true }],
        location: 'Fayette TX',
      };

      const response = await request(app.getHttpServer())
        .post('/vendor/create')
        .send(createVendorDto)
        .expect(401);

      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 401,
        }),
      );
    });
  });

  describe('/vendor/potentials (GET)', () => {
    it('should return potential vendors successfully', async () => {
      const jobId = 1;

      const response = await request(app.getHttpServer())
        .get(`/vendor/potentials?jobId=${jobId}`)
        .auth(process.env.ADMIN_USER, process.env.ADMIN_PASSWORD)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 401 Unauthorized when no auth is provided', async () => {
      const jobId = 1;

      const response = await request(app.getHttpServer())
        .get(`/vendor/potentials?jobId=${jobId}`)
        .expect(401);

      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 401,
        }),
      );
    });
  });

  describe('/vendor/summary (GET)', () => {
    it('should return vendor summary successfully', async () => {
      const getVendorsSummaryDto: GetVendorsSummaryDTO = {
        location: 'Fayette TX',
        service: 'Air Conditioning',
      };

      const response = await request(app.getHttpServer())
        .get(
          `/vendor/summary?location=${getVendorsSummaryDto.location}&service=${getVendorsSummaryDto.service}`,
        )
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          total: expect.any(Number),
          compliant: expect.any(Number),
          'not compliant': expect.any(Number),
        }),
      );
    });
  });
});
