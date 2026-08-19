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
import { JwtGuard } from '../common/guards/jwt.guard';

import { GuestService } from './guest.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { GetGuestsDto } from './dto/get-guests.dto';
import { Permissions as RequirePermission } from '../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { PERMISSIONS } from '../constants/permission.constant';

@Controller('guest')
@UseGuards(JwtGuard, PermissionsGuard)
export class GuestController {
  constructor(private readonly guestService: GuestService) {}

  @Post()
  @RequirePermission(PERMISSIONS.GUESTS_CREATE)
  async createGuest(@Body() dto: CreateGuestDto) {
    return this.guestService.createGuest(dto);
  }

  @Patch(':id')
  @RequirePermission(PERMISSIONS.GUESTS_UPDATE)
  updateGuest(@Param('id') id: string, @Body() dto: UpdateGuestDto) {
    return this.guestService.updateGuest(id, dto);
  }

  @Get()
  @RequirePermission(PERMISSIONS.GUESTS_VIEW)
  async getGuests(@Query() query: GetGuestsDto) {
    return this.guestService.getGuests(query);
  }

  @Delete(':id')
  @RequirePermission(PERMISSIONS.GUESTS_DELETE)
  async deleteGuest(@Param('id') id: string) {
    return this.guestService.delete(id);
  }
}
