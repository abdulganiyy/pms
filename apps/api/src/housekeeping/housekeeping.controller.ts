import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { HousekeepingService } from './housekeeping.service';

import { CreateHousekeepingTaskDto } from './dto/create-housekeeping-task.dto';
import { AssignHousekeepingTaskDto } from './dto/assign-housekeeping-task.dto';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from '../../generated/prisma';
import { GetHousekeepingTasksDto } from './dto/get-housekeeping-tasks.dto';

@Controller('housekeeping')
@UseGuards(JwtGuard, RolesGuard)
@Roles(RoleName.SUPER_ADMIN, RoleName.FRONT_DESK_MANAGER)
export class HousekeepingController {
  constructor(private readonly housekeepingService: HousekeepingService) {}

  @Post()
  create(@Body() dto: CreateHousekeepingTaskDto) {
    return this.housekeepingService.create(dto);
  }

  @Get()
  findAll(@Query() query: GetHousekeepingTasksDto) {
    return this.housekeepingService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.housekeepingService.findOne(id);
  }

  @Patch(':id/assign')
  assign(@Param('id') id: string, @Body() dto: AssignHousekeepingTaskDto) {
    return this.housekeepingService.assign(id, dto);
  }

  @Patch(':id/start')
  start(@Param('id') id: string) {
    return this.housekeepingService.start(id);
  }

  @Patch(':id/complete')
  complete(@Param('id') id: string) {
    return this.housekeepingService.complete(id);
  }

  @Delete(':id')
  cancel(@Param('id') id: string) {
    return this.housekeepingService.cancel(id);
  }
}
