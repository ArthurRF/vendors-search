import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { BasicAuthGuard } from '../basic-auth.guard';

dotenv.config();

describe('BasicAuthGuard', () => {
  let basicAuthGuard: BasicAuthGuard;

  beforeEach(() => {
    basicAuthGuard = new BasicAuthGuard();
  });

  const mockRequest = (authorizationHeader: string) => ({
    headers: { authorization: authorizationHeader },
  });

  const mockExecutionContext = (
    authorizationHeader: string,
  ): ExecutionContext => {
    return {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest(authorizationHeader)),
      }),
    } as unknown as ExecutionContext;
  };

  it('should return true for valid credentials', () => {
    const validAuthHeader = `Basic ${Buffer.from(
      `${process.env.ADMIN_USER}:${process.env.ADMIN_PASSWORD}`,
    ).toString('base64')}`;

    const context = mockExecutionContext(validAuthHeader);

    const result = basicAuthGuard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should throw UnauthorizedException if authorization header is missing', () => {
    const context = mockExecutionContext('');

    expect(() => basicAuthGuard.canActivate(context)).toThrow(
      UnauthorizedException,
    );
    expect(() => basicAuthGuard.canActivate(context)).toThrow(
      'Missing or invalid authorization header',
    );
  });

  it('should throw UnauthorizedException if authorization header is not Basic', () => {
    const context = mockExecutionContext('Bearer token');

    expect(() => basicAuthGuard.canActivate(context)).toThrow(
      UnauthorizedException,
    );
    expect(() => basicAuthGuard.canActivate(context)).toThrow(
      'Missing or invalid authorization header',
    );
  });

  it('should throw UnauthorizedException if credentials are invalid', () => {
    const invalidAuthHeader = `Basic ${Buffer.from(
      'vs_tech_challenge:WrongPassword',
    ).toString('base64')}`;

    const context = mockExecutionContext(invalidAuthHeader);

    expect(() => basicAuthGuard.canActivate(context)).toThrow(
      UnauthorizedException,
    );
    expect(() => basicAuthGuard.canActivate(context)).toThrow(
      'Invalid credentials',
    );
  });
});
