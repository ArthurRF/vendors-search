import {
  ArgumentsHost,
  BadRequestException,
  ConflictException,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { HttpExceptionFilter } from '../http-exception.filter';

describe('HttpExceptionFilter', () => {
  let httpExceptionFilter: HttpExceptionFilter;
  let response: Response;
  let host: ArgumentsHost;

  beforeEach(() => {
    httpExceptionFilter = new HttpExceptionFilter();
    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    host = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(response),
      }),
    } as unknown as ArgumentsHost;
  });

  it('should handle BadRequestException correctly', () => {
    const exception = new BadRequestException('Validation failed');
    httpExceptionFilter.catch(exception, host);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      mensagem: 'Validation failed',
    });
  });

  it('should handle ConflictException correctly', () => {
    const exception = new ConflictException('Resource conflict');
    httpExceptionFilter.catch(exception, host);

    expect(response.status).toHaveBeenCalledWith(409);
    expect(response.json).toHaveBeenCalledWith({
      mensagem: 'Resource conflict',
    });
  });

  it('should handle other HttpExceptions correctly', () => {
    const exception = new HttpException('Internal server error', 500);
    httpExceptionFilter.catch(exception, host);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({
      statusCode: 500,
      timestamp: expect.any(String),
      message: 'Internal server error',
    });
  });

  it('should handle BadRequestException with validation messages array', () => {
    const validationMessages = ['First error', 'Second error'];
    const exception = new BadRequestException(validationMessages);
    httpExceptionFilter.catch(exception, host);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      mensagem: 'First error',
    });
  });
});
