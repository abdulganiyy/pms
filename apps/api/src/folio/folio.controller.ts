import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { FolioService } from './folio.service';
import { CreateFolioDto } from './dto/create-folio.dto';
import { UpdateFolioDto } from './dto/update-folio.dto';
import { CreateFolioTransactionDto } from '../foliotransaction/dto/create-foliotransaction.dto';
import { JwtGuard } from '../common/guards/jwt.guard';
import { Permissions as RequirePermission } from '../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { PERMISSIONS } from '../constants/permission.constant';
import { GetFoliosDto } from './dto/get-folios.dto';
import { CreateFolioPaymentDto } from './dto/create-folio-payment.dto';

@UseGuards(JwtGuard, PermissionsGuard)
@Controller('folio')
export class FolioController {
  constructor(private readonly folioService: FolioService) {}

  @Post(':folioId/transaction')
  @RequirePermission(PERMISSIONS.FOLIOS_ADD_CHARGE)
  createTransaction(
    @Param('folioId') folioId: string,
    @Body() dto: CreateFolioTransactionDto,
  ) {
    return this.folioService.createTransaction(folioId, dto);
  }

  @Get(':id/transaction')
  @RequirePermission(PERMISSIONS.FOLIOS_VIEW)
  async getFolio(
    @Param('id')
    id: string,
  ) {
    return this.folioService.getReservationFolio(id);
  }

  @Post(':id/folio/payment')
  @RequirePermission(PERMISSIONS.PAYMENTS_COLLECT)
  async createPayment(
    @Param('id')
    id: string,

    @Body()
    dto: CreateFolioPaymentDto,
  ) {
    return this.folioService.createPayment(id, dto);
  }

  @Get()
  @RequirePermission(PERMISSIONS.FOLIOS_VIEW)
  findAll(@Query() query: GetFoliosDto) {
    return this.folioService.findAll(query);
  }
}
