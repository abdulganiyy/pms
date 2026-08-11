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
import { RoomrateService } from './roomrate.service';
import { CreateRoomRateDto } from './dto/create-roomrate.dto';
import { UpdateRoomRateDto } from './dto/update-roomrate.dto';
import { GetRoomRatesDto } from './dto/get-roomrates.dto';

@UseGuards(JwtGuard, RolesGuard)
@Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
@Controller('roomrate')
export class RoomrateController {
  constructor(private readonly roomrateService: RoomrateService) {}

  @Post()
  create(@Body() createRoomrateDto: CreateRoomRateDto) {
    return this.roomrateService.create(createRoomrateDto);
  }

  @Get()
  findAll(@Query() query: GetRoomRatesDto) {
    return this.roomrateService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomrateService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRoomrateDto: UpdateRoomRateDto,
  ) {
    return this.roomrateService.update(id, updateRoomrateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomrateService.remove(id);
  }
}
