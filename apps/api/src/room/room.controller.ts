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
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permissions as RequirePermission } from '../common/decorators/permissions.decorator';
import { PERMISSIONS } from '../constants/permission.constant';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomService } from './room.service';
import { GetRoomsDto } from './dto/get-rooms.dto';

@UseGuards(JwtGuard, PermissionsGuard)
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @RequirePermission(PERMISSIONS.ROOMS_CREATE)
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  @Get()
  @RequirePermission(PERMISSIONS.ROOMS_VIEW)
  findAll(@Query() query: GetRoomsDto) {
    return this.roomService.findAll(query);
  }

  @Get(':id')
  @RequirePermission(PERMISSIONS.ROOMS_VIEW)
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(id);
  }

  @Patch(':id')
  @RequirePermission(PERMISSIONS.ROOMS_UPDATE)
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.update(id, updateRoomDto);
  }

  @Delete(':id')
  @RequirePermission(PERMISSIONS.ROOMS_DELETE)
  remove(@Param('id') id: string) {
    return this.roomService.remove(id);
  }
}
