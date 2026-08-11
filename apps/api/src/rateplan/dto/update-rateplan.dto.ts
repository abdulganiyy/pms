import { PartialType } from '@nestjs/mapped-types';
import { CreateRatePlanDto } from './create-rateplan.dto';

export class UpdateRatePlanDto extends PartialType(CreateRatePlanDto) {}
