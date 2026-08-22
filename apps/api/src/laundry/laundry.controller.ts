import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { LaundryService } from './laundry.service';

import { CreateLaundryItemDto } from './dto/create-laundry-item.dto';
import { UpdateLaundryItemDto } from './dto/update-laundry-item.dto';
import { CreateLaundryOrderDto } from './dto/create-laundry-order.dto';
import { UpdateLaundryOrderStatusDto } from './dto/update-laundry-order-status.dto';
import { PayLaundryOrderDto } from './dto/pay-laundry-order.dto';
import { RefundLaundryOrderDto } from './dto/refund-laundry-order.dto';
import { GetLaundryOrdersDto } from './dto/get-laundry-orders.dto';

@Controller('laundry')
export class LaundryController {
  constructor(private readonly laundryService: LaundryService) {}

  @Post('item')
  createItem(@Body() dto: CreateLaundryItemDto) {
    return this.laundryService.createItem(dto);
  }

  @Get('item')
  findItems() {
    return this.laundryService.findItems();
  }

  @Get('item/:id')
  findItem(@Param('id') id: string) {
    return this.laundryService.findItem(id);
  }

  @Patch('item/:id')
  updateItem(@Param('id') id: string, @Body() dto: UpdateLaundryItemDto) {
    return this.laundryService.updateItem(id, dto);
  }

  @Patch('item/:id/deactivate')
  deactivateItem(@Param('id') id: string) {
    return this.laundryService.deactivateItem(id);
  }

  @Post('order')
  createOrder(@Body() dto: CreateLaundryOrderDto) {
    return this.laundryService.createOrder(dto);
  }

  @Get('order')
  findAllOrders(@Query() query: GetLaundryOrdersDto) {
    return this.laundryService.findAllOrders(query);
  }

  @Get('order/:id')
  findOrder(@Param('id') id: string) {
    return this.laundryService.findOrder(id);
  }

  @Patch('order/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateLaundryOrderStatusDto,
  ) {
    return this.laundryService.updateStatus(id, dto);
  }

  @Post('order/:id/roomcharge')
  roomCharge(@Param('id') id: string) {
    return this.laundryService.roomCharge(id);
  }

  @Post('order/:id/pay')
  pay(@Param('id') id: string, @Body() dto: PayLaundryOrderDto) {
    return this.laundryService.pay(id, dto);
  }

  @Post('order/:id/refund')
  refund(@Param('id') id: string, @Body() dto: RefundLaundryOrderDto) {
    return this.laundryService.refund(id, dto);
  }
}
