import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CheckAvailabilityDto } from './dto/check-availability.dto';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get('roomtype')
  getRoomTypes() {
    return this.bookingService.getRoomTypes();
  }

  @Get('availability')
  checkAvailability(@Query() query: CheckAvailabilityDto) {
    return this.bookingService.checKAvailability(query);
  }

  @Post()
  creatBooking(@Body() dto: CreateBookingDto) {
    return this.bookingService.createBooking(dto);
  }
}
