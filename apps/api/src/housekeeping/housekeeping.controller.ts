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
import { Permissions as RequirePermission } from '../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { PERMISSIONS } from '../constants/permission.constant';
import { GetHousekeepingTasksDto } from './dto/get-housekeeping-tasks.dto';

@Controller('housekeeping')
@UseGuards(JwtGuard, PermissionsGuard)
export class HousekeepingController {
  constructor(private readonly housekeepingService: HousekeepingService) {}

  @Post()
  @RequirePermission(PERMISSIONS.HOUSEKEEPING_CREATE_TASK)
  create(@Body() dto: CreateHousekeepingTaskDto) {
    return this.housekeepingService.create(dto);
  }

  @Get()
  @RequirePermission(PERMISSIONS.HOUSEKEEPING_VIEW_HISTORY)
  findAll(@Query() query: GetHousekeepingTasksDto) {
    return this.housekeepingService.findAll(query);
  }

  @Get(':id')
  @RequirePermission(PERMISSIONS.HOUSEKEEPING_VIEW)
  findOne(@Param('id') id: string) {
    return this.housekeepingService.findOne(id);
  }

  @Patch(':id/assign')
  @RequirePermission(PERMISSIONS.HOUSEKEEPING_ASSIGN_TASK)
  assign(@Param('id') id: string, @Body() dto: AssignHousekeepingTaskDto) {
    return this.housekeepingService.assign(id, dto);
  }

  @Patch(':id/start')
  @RequirePermission(PERMISSIONS.HOUSEKEEPING_START_TASK)
  start(@Param('id') id: string) {
    return this.housekeepingService.start(id);
  }

  @Patch(':id/complete')
  @RequirePermission(PERMISSIONS.HOUSEKEEPING_COMPLETE_TASK)
  complete(@Param('id') id: string) {
    return this.housekeepingService.complete(id);
  }

  @Delete(':id')
  @RequirePermission(PERMISSIONS.HOUSEKEEPING_REJECT_ROOM)
  cancel(@Param('id') id: string) {
    return this.housekeepingService.cancel(id);
  }
}
