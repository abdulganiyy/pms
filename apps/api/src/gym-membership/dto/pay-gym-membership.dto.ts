import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

import { PaymentMethod } from '../../../generated/prisma';

export class PayGymMembershipDto {
  @IsNumber()
  @Min(0.01)
  amount!: number;

  @IsEnum(PaymentMethod)
  method!: PaymentMethod;

  @IsOptional()
  @IsString()
  reference?: string;
}
