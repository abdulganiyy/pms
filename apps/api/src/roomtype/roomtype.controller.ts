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
import { RoomtypeService } from './roomtype.service';
import { CreateRoomTypeDto } from './dto/create-roomtype.dto';
import { UpdateRoomTypeDto } from './dto/update-roomtype.dto';
import { GetRoomTypesDto } from './dto/get-roomtypes.dto';

@UseGuards(JwtGuard, PermissionsGuard)
@Controller('roomtype')
export class RoomtypeController {
  constructor(private readonly roomtypeService: RoomtypeService) {}

  @Post()
  @RequirePermission(PERMISSIONS.ROOM_TYPES_CREATE)
  create(@Body() createRoomtypeDto: CreateRoomTypeDto) {
    return this.roomtypeService.create(createRoomtypeDto);
  }

  @Get()
  @RequirePermission(PERMISSIONS.ROOM_TYPES_VIEW)
  findAll(@Query() query: GetRoomTypesDto) {
    return this.roomtypeService.findAll(query);
  }

  @Get(':id')
  @RequirePermission(PERMISSIONS.ROOM_TYPES_VIEW)
  findOne(@Param('id') id: string) {
    return this.roomtypeService.findOne(id);
  }

  @Patch(':id')
  @RequirePermission(PERMISSIONS.ROOM_TYPES_UPDATE)
  update(
    @Param('id') id: string,
    @Body() updateRoomtypeDto: UpdateRoomTypeDto,
  ) {
    return this.roomtypeService.update(id, updateRoomtypeDto);
  }

  @Delete(':id')
  @RequirePermission(PERMISSIONS.ROOM_TYPES_DELETE)
  remove(@Param('id') id: string) {
    return this.roomtypeService.remove(id);
  }
}
