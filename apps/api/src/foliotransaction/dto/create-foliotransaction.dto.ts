import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { FolioTransactionType } from '../../../generated/prisma';

export class CreateFolioTransactionDto {
  @IsEnum(FolioTransactionType)
  type!: FolioTransactionType;

  @IsNumber()
  @Min(0)
  amount!: number;

  @IsString()
  @IsNotEmpty()
  description!: string;
}
