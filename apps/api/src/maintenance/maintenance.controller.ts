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
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from '../../generated/prisma';
import { GetMaintenancesDto } from './dto/get-maintenaces.dto';

@Controller('maintenance')
@UseGuards(JwtGuard, RolesGuard)
@Roles(RoleName.SUPER_ADMIN, RoleName.FRONT_DESK_MANAGER)
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Post()
  create(@Body() dto: CreateMaintenanceTicketDto) {
    return this.maintenanceService.create(dto);
  }

  @Get()
  findAll(@Query() query: GetMaintenancesDto) {
    return this.maintenanceService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.maintenanceService.findOne(id);
  }

  @Patch(':id/assign')
  assign(@Param('id') id: string, @Body() dto: AssignMaintenanceTicketDto) {
    return this.maintenanceService.assign(id, dto);
  }

  @Patch(':id/start')
  start(@Param('id') id: string) {
    return this.maintenanceService.start(id);
  }

  @Patch(':id/resolve')
  resolve(@Param('id') id: string) {
    return this.maintenanceService.resolve(id);
  }

  @Delete(':id')
  cancel(@Param('id') id: string) {
    return this.maintenanceService.cancel(id);
  }
}
