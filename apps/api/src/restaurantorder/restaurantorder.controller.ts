import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RestaurantorderService } from './restaurantorder.service';
import { CreateRestaurantOrderDto } from './dto/create-restaurantorder.dto';
import { GetRestaurantOrdersDto } from './dto/get-restaurantorders.dto';
import { JwtGuard } from '../common/guards/jwt.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permissions as RequirePermission } from '../common/decorators/permissions.decorator';
import { PERMISSIONS } from '../constants/permission.constant';
import { CancelRestaurantOrderDto } from './dto/cancel-restaurantorder.dto';
import { PayRestaurantOrderDto } from './dto/pay-restaurantorder.dto';
import { RefundRestaurantOrderDto } from './dto/refund-restaurantorder.dto';

@UseGuards(JwtGuard, PermissionsGuard)
@Controller('restaurantorder')
export class RestaurantorderController {
  constructor(
    private readonly restaurantorderService: RestaurantorderService,
  ) {}

  @Post()
  @RequirePermission(PERMISSIONS.RESTAURANT_CREATE_ORDER)
  create(
    @Body() createRestaurantorderDto: CreateRestaurantOrderDto,
    @Req() req: any,
  ) {
    return this.restaurantorderService.create(
      createRestaurantorderDto,
      req.user!.userId,
    );
  }

  @Get()
  @RequirePermission(PERMISSIONS.RESTAURANT_VIEW)
  findAll(@Query() query: GetRestaurantOrdersDto) {
    return this.restaurantorderService.findAll(query);
  }

  @Get(':id')
  @RequirePermission(PERMISSIONS.RESTAURANT_VIEW)
  findOne(@Param('id') id: string) {
    return this.restaurantorderService.findOne(id);
  }

  @Post(':id/prepare')
  @RequirePermission(PERMISSIONS.RESTAURANT_UPDATE_ORDER_STATUS)
  async send(@Param('id') id: string) {
    return this.restaurantorderService.prepare(id);
  }

  @Post(':id/serve')
  @RequirePermission(PERMISSIONS.RESTAURANT_UPDATE_ORDER_STATUS)
  async serve(@Param('id') id: string) {
    return this.restaurantorderService.serve(id);
  }

  @Post(':id/cancel')
  @RequirePermission(PERMISSIONS.RESTAURANT_CANCEL_ORDER)
  async cancel(@Param('id') id: string, @Body() dto: CancelRestaurantOrderDto) {
    return this.restaurantorderService.cancel(id, dto.reason);
  }

  @Post(':id/complete')
  @RequirePermission(PERMISSIONS.RESTAURANT_CLOSE_ORDER)
  async complete(@Param('id') id: string) {
    return this.restaurantorderService.complete(id);
  }

  @Post(':id/roomcharge')
  @RequirePermission(PERMISSIONS.ROOM_CHARGES_POST)
  async roomCharge(@Param('id') id: string) {
    return this.restaurantorderService.roomCharge(id);
  }

  @Post(':id/pay')
  @RequirePermission(PERMISSIONS.PAYMENTS_CREATE)
  async pay(@Param('id') id: string, @Body() dto: PayRestaurantOrderDto) {
    return this.restaurantorderService.pay(id, dto);
  }

  @Post(':id/refund')
  @RequirePermission(PERMISSIONS.PAYMENTS_REFUND)
  async refund(@Param('id') id: string, @Body() dto: RefundRestaurantOrderDto) {
    return this.restaurantorderService.refund(id, dto);
  }
}
