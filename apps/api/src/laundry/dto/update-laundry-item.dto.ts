import { PartialType } from '@nestjs/mapped-types';
import { CreateLaundryItemDto } from './create-laundry-item.dto';

export class UpdateLaundryItemDto extends PartialType(CreateLaundryItemDto) {}
