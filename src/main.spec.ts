import * as dotenv from 'dotenv';
import { bootstrap } from './main';
dotenv.config();

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn().mockResolvedValue({
      enableVersioning: jest.fn(),
      useGlobalPipes: jest.fn(),
      useGlobalFilters: jest.fn(),
      listen: jest.fn(),
    }),
  },
}));

describe('Bootstrap', () => {
  it('should throw an error if a required environment variable is missing', async () => {
    const originalEnv = { ...process.env };

    delete process.env.ADMIN_USER;

    await expect(bootstrap()).rejects.toThrow(
      'Missing environment variable: ADMIN_USER',
    );

    process.env = originalEnv;
  });

  it('should not throw an error if all required environment variables are set', async () => {
    await expect(bootstrap()).resolves.not.toThrow();
  });
});
