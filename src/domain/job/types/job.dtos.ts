import { IsNotEmpty, IsString } from 'class-validator';

export class CreateJobDTO {
  @IsString()
  @IsNotEmpty({ message: 'Required field "name" is empty' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Required field "serviceCategory" is empty' })
  serviceCategory: string;

  @IsString()
  @IsNotEmpty({ message: 'Required field "location" is empty' })
  location: string;
}
