import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsBoolean,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateVendorDTO {
  @IsString()
  @IsNotEmpty({ message: 'Required field "name" is empty' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Required field "location" is empty' })
  location: string;

  @ValidateNested({ each: true })
  @ArrayNotEmpty({ message: 'The services array must not be empty' })
  @Type(() => ServiceDTO)
  services: ServiceDTO[];
}

class ServiceDTO {
  @IsString()
  @IsNotEmpty({ message: 'Required field "service name" is empty' })
  name: string;

  @IsBoolean()
  compliant: boolean;
}

export class GetVendorsSummaryDTO {
  @IsString()
  @IsNotEmpty({ message: 'Required field "location" is empty' })
  location: string;

  @IsString()
  @IsNotEmpty({ message: 'Required field "service" is empty' })
  service: string;
}
