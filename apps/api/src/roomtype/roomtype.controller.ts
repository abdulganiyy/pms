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
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from '../../generated/prisma';
import { RoomtypeService } from './roomtype.service';
import { CreateRoomTypeDto } from './dto/create-roomtype.dto';
import { UpdateRoomTypeDto } from './dto/update-roomtype.dto';
import { GetRoomTypesDto } from './dto/get-roomtypes.dto';

@UseGuards(JwtGuard, RolesGuard)
@Roles(RoleName.SUPER_ADMIN, RoleName.OWNER, RoleName.FRONT_DESK_MANAGER)
@Controller('roomtype')
export class RoomtypeController {
  constructor(private readonly roomtypeService: RoomtypeService) {}

  @Post()
  create(@Body() createRoomtypeDto: CreateRoomTypeDto) {
    return this.roomtypeService.create(createRoomtypeDto);
  }

  @Get()
  findAll(@Query() query: GetRoomTypesDto) {
    return this.roomtypeService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomtypeService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRoomtypeDto: UpdateRoomTypeDto,
  ) {
    return this.roomtypeService.update(id, updateRoomtypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomtypeService.remove(id);
  }
}
