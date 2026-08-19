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
import { RoomrateService } from './roomrate.service';
import { CreateRoomRateDto } from './dto/create-roomrate.dto';
import { UpdateRoomRateDto } from './dto/update-roomrate.dto';
import { GetRoomRatesDto } from './dto/get-roomrates.dto';

@UseGuards(JwtGuard, PermissionsGuard)
@Controller('roomrate')
export class RoomrateController {
  constructor(private readonly roomrateService: RoomrateService) {}

  @Post()
  @RequirePermission(PERMISSIONS.RATES_CREATE)
  create(@Body() createRoomrateDto: CreateRoomRateDto) {
    return this.roomrateService.create(createRoomrateDto);
  }

  @Get()
  @RequirePermission(PERMISSIONS.RATES_VIEW)
  findAll(@Query() query: GetRoomRatesDto) {
    return this.roomrateService.findAll(query);
  }

  @Get(':id')
  @RequirePermission(PERMISSIONS.RATES_VIEW)
  findOne(@Param('id') id: string) {
    return this.roomrateService.findOne(id);
  }

  @Patch(':id')
  @RequirePermission(PERMISSIONS.RATES_UPDATE)
  update(
    @Param('id') id: string,
    @Body() updateRoomrateDto: UpdateRoomRateDto,
  ) {
    return this.roomrateService.update(id, updateRoomrateDto);
  }

  @Delete(':id')
  @RequirePermission(PERMISSIONS.RATES_DELETE)
  remove(@Param('id') id: string) {
    return this.roomrateService.remove(id);
  }
}
