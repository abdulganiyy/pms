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
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from '../../generated/prisma';
import { CancelRestaurantOrderDto } from './dto/cancel-restaurantorder.dto';
import { PayRestaurantOrderDto } from './dto/pay-restaurantorder.dto';
import { RefundRestaurantOrderDto } from './dto/refund-restaurantorder.dto';

@UseGuards(JwtGuard, RolesGuard)
@Roles(RoleName.SUPER_ADMIN, RoleName.OWNER, RoleName.FRONT_DESK_MANAGER)
@Controller('restaurantorder')
export class RestaurantorderController {
  constructor(
    private readonly restaurantorderService: RestaurantorderService,
  ) {}

  @Post()
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
  findAll(@Query() query: GetRestaurantOrdersDto) {
    return this.restaurantorderService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantorderService.findOne(id);
  }

  @Post(':id/prepare')
  async send(@Param('id') id: string) {
    return this.restaurantorderService.prepare(id);
  }

  @Post(':id/serve')
  async serve(@Param('id') id: string) {
    return this.restaurantorderService.serve(id);
  }

  @Post(':id/cancel')
  async cancel(@Param('id') id: string, @Body() dto: CancelRestaurantOrderDto) {
    return this.restaurantorderService.cancel(id, dto.reason);
  }

  @Post(':id/complete')
  async complete(@Param('id') id: string) {
    return this.restaurantorderService.complete(id);
  }

  @Post(':id/roomcharge')
  async roomCharge(@Param('id') id: string) {
    return this.restaurantorderService.roomCharge(id);
  }

  @Post(':id/pay')
  async pay(@Param('id') id: string, @Body() dto: PayRestaurantOrderDto) {
    return this.restaurantorderService.pay(id, dto);
  }

  @Post(':id/refund')
  async refund(@Param('id') id: string, @Body() dto: RefundRestaurantOrderDto) {
    return this.restaurantorderService.refund(id, dto);
  }
}
