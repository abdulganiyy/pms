import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomRateDto } from './create-roomrate.dto';

export class UpdateRoomRateDto extends PartialType(CreateRoomRateDto) {}
