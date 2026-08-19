import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GetPaymentsDto } from './dto/get-payments.dto';
import { PaymentService } from './payment.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { Permissions as RequirePermission } from '../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { PERMISSIONS } from '../constants/permission.constant';

@UseGuards(JwtGuard, PermissionsGuard)
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  @RequirePermission(PERMISSIONS.PAYMENTS_VIEW)
  findAll(@Query() query: GetPaymentsDto) {
    return this.paymentService.findAll(query);
  }
}
