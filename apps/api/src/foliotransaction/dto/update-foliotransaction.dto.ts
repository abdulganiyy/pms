import { PartialType } from '@nestjs/mapped-types';
import { CreateFolioTransactionDto } from './create-foliotransaction.dto';

export class UpdateFolioTransactionDto extends PartialType(
  CreateFolioTransactionDto,
) {}
