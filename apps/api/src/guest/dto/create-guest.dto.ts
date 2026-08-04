import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Gender } from '../../../generated/prisma';

export class CreateGuestDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsString()
  gender?: Gender;

  @IsOptional()
  @IsString()
  dateOfBirth?: Date;
}
