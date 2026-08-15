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
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from '../../generated/prisma';
import { GetFoliosDto } from './dto/get-folios.dto';
import { CreateFolioPaymentDto } from './dto/create-folio-payment.dto';

@UseGuards(JwtGuard, RolesGuard)
@Roles(RoleName.SUPER_ADMIN, RoleName.OWNER, RoleName.FRONT_DESK_MANAGER)
@Controller('folio')
export class FolioController {
  constructor(private readonly folioService: FolioService) {}

  @Post(':folioId/transaction')
  createTransaction(
    @Param('folioId') folioId: string,
    @Body() dto: CreateFolioTransactionDto,
  ) {
    return this.folioService.createTransaction(folioId, dto);
  }

  @Get(':id/transaction')
  async getFolio(
    @Param('id')
    id: string,
  ) {
    return this.folioService.getReservationFolio(id);
  }

  @Post(':id/folio/payment')
  async createPayment(
    @Param('id')
    id: string,

    @Body()
    dto: CreateFolioPaymentDto,
  ) {
    return this.folioService.createPayment(id, dto);
  }

  @Get()
  findAll(@Query() query: GetFoliosDto) {
    return this.folioService.findAll(query);
  }
}
