import { PartialType } from '@nestjs/mapped-types';
import { CreateGymMembershipPlanDto } from './create-gym-membership-plan.dto';

export class UpdateGymMembershipPlanDto extends PartialType(
  CreateGymMembershipPlanDto,
) {}
