import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { PermissionService } from './permission.service';

import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import { PERMISSIONS } from '../constants/permission.constant';
import { JwtGuard } from '../common/guards/jwt.guard';

@UseGuards(JwtGuard, PermissionsGuard)
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @Permissions(PERMISSIONS.PERMISSIONS_VIEW)
  findAll() {
    return this.permissionService.findAll();
  }

  @Get(':id')
  @Permissions(PERMISSIONS.PERMISSIONS_VIEW)
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(id);
  }
}
