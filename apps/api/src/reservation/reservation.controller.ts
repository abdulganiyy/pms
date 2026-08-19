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
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permissions as RequirePermission } from '../common/decorators/permissions.decorator';
import { PERMISSIONS } from '../constants/permission.constant';
import { CancelReservationDto } from './dto/cancel-reservation.dto';
import { ChangeReservationRoomDto } from './dto/change-reservation-room.dto';
import { GetReservationsDto } from './dto/get-reservations.dto';
import { FolioService } from '../folio/folio.service';
import { CreateFolioPaymentDto } from '../folio/dto/create-folio-payment.dto';

@UseGuards(JwtGuard, PermissionsGuard)
@Controller('reservation')
export class ReservationController {
  constructor(
    private readonly reservationService: ReservationService,
    private folioService: FolioService,
  ) {}

  @Post()
  @RequirePermission(PERMISSIONS.RESERVATIONS_CREATE)
  create(@Body() dto: CreateReservationDto, @Req() req: any) {
    return this.reservationService.create(dto, req.user?.id);
  }

  @Patch(':id')
  @RequirePermission(PERMISSIONS.RESERVATIONS_UPDATE)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateReservationDto,
    @Req() req: any,
  ) {
    return this.reservationService.update(id, dto, req.user?.id);
  }

  @Post(':id/cancel')
  @RequirePermission(PERMISSIONS.RESERVATIONS_CANCEL)
  cancel(
    @Param('id') id: string,
    @Body() dto: CancelReservationDto,
    @Req() req: any,
  ) {
    return this.reservationService.cancel(id, dto.reason, req.user?.id);
  }

  @Post(':id/checkin')
  @RequirePermission(PERMISSIONS.RESERVATIONS_CHECK_IN)
  checkIn(@Param('id') id: string, @Req() req: any) {
    return this.reservationService.checkIn(id, req.user?.id);
  }

  @Post(':id/checkout')
  @RequirePermission(PERMISSIONS.RESERVATIONS_CHECK_OUT)
  checkOut(@Param('id') id: string, @Req() req: any) {
    return this.reservationService.checkOut(id, req.user?.id);
  }

  @Post(':id/noshow')
  @RequirePermission(PERMISSIONS.RESERVATIONS_NO_SHOW)
  noShow(@Param('id') id: string, @Req() req: any) {
    return this.reservationService.noShow(id, req.user?.id);
  }

  @Post(':id/changeroom')
  @RequirePermission(PERMISSIONS.RESERVATIONS_CHANGE_ROOM)
  changeRoom(
    @Param('id') id: string,
    @Body() dto: ChangeReservationRoomDto,
    @Req() req: any,
  ) {
    return this.reservationService.changeRoom(id, dto, req.user?.id);
  }

  @Get(':id/transaction')
  @RequirePermission(PERMISSIONS.FOLIOS_VIEW)
  async getFolio(
    @Param('id')
    id: string,
  ) {
    return this.folioService.getReservationFolio(id);
  }

  @Post(':id/payment')
  @RequirePermission(PERMISSIONS.PAYMENTS_CREATE)
  async makePayment(
    @Param('id')
    id: string,
    @Body() dto: CreateFolioPaymentDto,
  ) {
    return this.folioService.createPayment(id, dto);
  }

  @Get()
  @RequirePermission(PERMISSIONS.RESERVATIONS_VIEW_ALL)
  findAll(@Query() query: GetReservationsDto) {
    return this.reservationService.findAll(query);
  }

  @Get(':id')
  @RequirePermission(PERMISSIONS.RESERVATIONS_VIEW)
  findOne(@Param('id') id: string) {
    return this.reservationService.findOne(id);
  }

  @Delete(':id')
  @RequirePermission(PERMISSIONS.RESERVATIONS_DELETE)
  remove(@Param('id') id: string) {
    return this.reservationService.remove(id);
  }
}
