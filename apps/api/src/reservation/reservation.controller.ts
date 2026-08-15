import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from '../../generated/prisma';
import { CancelReservationDto } from './dto/cancel-reservation.dto';
import { ChangeReservationRoomDto } from './dto/change-reservation-room.dto';
import { GetReservationsDto } from './dto/get-reservations.dto';
import { FolioService } from '../folio/folio.service';
import { CreateFolioPaymentDto } from '../folio/dto/create-folio-payment.dto';

@UseGuards(JwtGuard, RolesGuard)
@Roles(RoleName.SUPER_ADMIN, RoleName.OWNER, RoleName.FRONT_DESK_MANAGER)
@Controller('reservation')
export class ReservationController {
  constructor(
    private readonly reservationService: ReservationService,
    private folioService: FolioService,
  ) {}

  @Post()
  create(@Body() dto: CreateReservationDto, @Req() req: any) {
    return this.reservationService.create(dto, req.user?.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateReservationDto,
    @Req() req: any,
  ) {
    return this.reservationService.update(id, dto, req.user?.id);
  }

  @Post(':id/cancel')
  cancel(
    @Param('id') id: string,
    @Body() dto: CancelReservationDto,
    @Req() req: any,
  ) {
    return this.reservationService.cancel(id, dto.reason, req.user?.id);
  }

  @Post(':id/checkin')
  checkIn(@Param('id') id: string, @Req() req: any) {
    return this.reservationService.checkIn(id, req.user?.id);
  }

  @Post(':id/checkout')
  checkOut(@Param('id') id: string, @Req() req: any) {
    return this.reservationService.checkOut(id, req.user?.id);
  }

  @Post(':id/noshow')
  noShow(@Param('id') id: string, @Req() req: any) {
    return this.reservationService.noShow(id, req.user?.id);
  }

  @Post(':id/changeroom')
  changeRoom(
    @Param('id') id: string,
    @Body() dto: ChangeReservationRoomDto,
    @Req() req: any,
  ) {
    return this.reservationService.changeRoom(id, dto, req.user?.id);
  }

  @Get(':id/transaction')
  async getFolio(
    @Param('id')
    id: string,
  ) {
    return this.folioService.getReservationFolio(id);
  }

  @Post(':id/payment')
  async makePayment(
    @Param('id')
    id: string,
    @Body() dto: CreateFolioPaymentDto,
  ) {
    return this.folioService.createPayment(id, dto);
  }

  @Get()
  findAll(@Query() query: GetReservationsDto) {
    return this.reservationService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationService.remove(id);
  }
}
