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

import { MaintenanceService } from './maintenance.service';

import { CreateMaintenanceTicketDto } from './dto/create-maintenance-ticket.dto';
import { AssignMaintenanceTicketDto } from './dto/assign-maintenance-ticket.dto';
import { JwtGuard } from '../common/guards/jwt.guard';
import { Permissions as RequirePermission } from '../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { PERMISSIONS } from '../constants/permission.constant';
import { GetMaintenancesDto } from './dto/get-maintenaces.dto';

@Controller('maintenance')
@UseGuards(JwtGuard, PermissionsGuard)
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Post()
  @RequirePermission(PERMISSIONS.MAINTENANCE_CREATE)
  create(@Body() dto: CreateMaintenanceTicketDto) {
    return this.maintenanceService.create(dto);
  }

  @Get()
  @RequirePermission(PERMISSIONS.MAINTENANCE_VIEW_HISTORY)
  findAll(@Query() query: GetMaintenancesDto) {
    return this.maintenanceService.findAll(query);
  }

  @Get(':id')
  @RequirePermission(PERMISSIONS.MAINTENANCE_VIEW)
  findOne(@Param('id') id: string) {
    return this.maintenanceService.findOne(id);
  }

  @Patch(':id/assign')
  @RequirePermission(PERMISSIONS.MAINTENANCE_ASSIGN)
  assign(@Param('id') id: string, @Body() dto: AssignMaintenanceTicketDto) {
    return this.maintenanceService.assign(id, dto);
  }

  @Patch(':id/start')
  @RequirePermission(PERMISSIONS.MAINTENANCE_START)
  start(@Param('id') id: string) {
    return this.maintenanceService.start(id);
  }

  @Patch(':id/resolve')
  @RequirePermission(PERMISSIONS.MAINTENANCE_COMPLETE)
  resolve(@Param('id') id: string) {
    return this.maintenanceService.resolve(id);
  }

  @Delete(':id')
  @RequirePermission(PERMISSIONS.MAINTENANCE_DELETE)
  cancel(@Param('id') id: string) {
    return this.maintenanceService.cancel(id);
  }
}
