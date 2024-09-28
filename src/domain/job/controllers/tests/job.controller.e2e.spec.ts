import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';
import { CreateJobDTO } from '../../types/job.dtos';

describe('JobController (e2e)', () => {
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

  describe('/job/create (POST)', () => {
    it('should create a job successfully', async () => {
      const createJobDto: CreateJobDTO = {
        location: 'Fayette TX',
        name: 'Landscaping Maintenance',
        serviceCategory: 'Landscaping Maintenance',
      };

      const response = await request(app.getHttpServer())
        .post('/job/create')
        .auth(process.env.ADMIN_USER, process.env.ADMIN_PASSWORD)
        .send(createJobDto)
        .expect(201);

      expect(response.body).toEqual(
        expect.objectContaining({
          name: 'Landscaping Maintenance',
          serviceCategoryId: 4,
          locationId: 10,
        }),
      );
    });

    it('should throw BadRequestException if service category is invalid', async () => {
      const createJobDto: CreateJobDTO = {
        location: 'Fayette TX',
        name: 'Invalid Service Job',
        serviceCategory: 'Invalid Service',
      };

      const response = await request(app.getHttpServer())
        .post('/job/create')
        .auth(process.env.ADMIN_USER, process.env.ADMIN_PASSWORD)
        .send(createJobDto)
        .expect(400);

      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 400,
          message: 'Service category not found',
          error: 'Bad Request',
        }),
      );
    });

    it('should return 401 Unauthorized when no auth is provided', async () => {
      const createJobDto: CreateJobDTO = {
        location: 'Fayette TX',
        name: 'Unauthorized Job',
        serviceCategory: 'Landscaping Maintenance',
      };

      const response = await request(app.getHttpServer())
        .post('/job/create')
        .send(createJobDto)
        .expect(401);

      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 401,
        }),
      );
    });
  });
});
