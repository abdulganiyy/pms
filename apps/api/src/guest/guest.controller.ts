import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from '../../generated/prisma';
import { GuestService } from './guest.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { GetGuestsDto } from './dto/get-guests.dto';

@Controller('guest')
@UseGuards(JwtGuard, RolesGuard)
@Roles(RoleName.SUPER_ADMIN, RoleName.USER)
export class GuestController {
  constructor(private readonly guestService: GuestService) {}

  @Post()
  async createGuest(@Body() dto: CreateGuestDto) {
    return this.guestService.createGuest(dto);
  }

  @Patch(':id')
  updateGuest(@Param('id') id: string, @Body() dto: UpdateGuestDto) {
    return this.guestService.updateGuest(id, dto);
  }

  @Get()
  async getGuests(@Query() query: GetGuestsDto) {
    return this.guestService.getGuests(query);
  }

  @Delete(':id')
  async deleteGuest(@Param('id') id: string) {
    return this.guestService.delete(id);
  }
}
