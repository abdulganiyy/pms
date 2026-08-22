import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { LaundryItemType } from '../../../generated/prisma';

export class CreateLaundryItemDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(LaundryItemType)
  type!: LaundryItemType;

  @IsNumber()
  @Min(0)
  price!: number;
}
