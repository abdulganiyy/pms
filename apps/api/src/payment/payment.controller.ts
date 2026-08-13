import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GetPaymentsDto } from './dto/get-payments.dto';
import { PaymentService } from './payment.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from '../../generated/prisma';

@UseGuards(JwtGuard, RolesGuard)
@Roles(RoleName.SUPER_ADMIN, RoleName.OWNER, RoleName.FRONT_DESK_MANAGER)
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  findAll(@Query() query: GetPaymentsDto) {
    return this.paymentService.findAll(query);
  }
}
