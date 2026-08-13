import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from '../../generated/prisma';
import { GetUsersDto } from './dto/get-users.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUser } from '../common/decorators/get-user.decorator';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permissions as RequirePermission } from '../common/decorators/permissions.decorator';
import { PERMISSIONS } from '../constants/permission.constant';
import { UpdateUserRolesDto } from './dto/update-user-roles.dto';

@Controller('user')
@UseGuards(JwtGuard, RolesGuard)
@Roles(RoleName.SUPER_ADMIN, RoleName.OWNER)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(id, dto);
  }

  @Get()
  async getUsers(@Query() query: GetUsersDto) {
    return this.userService.getUsers(query);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.softdelete(id);
  }

  /**
   * GET /users/:id/roles
   */
  @Get(':id/roles')
  @RequirePermission(PERMISSIONS.ROLES_VIEW)
  getRoles(@Param('id') id: string) {
    return this.userService.getRoles(id);
  }

  /**
   * PATCH /users/:id/roles
   *
   * Replace all roles assigned to the user.
   */
  @Patch(':id/roles')
  @RequirePermission(PERMISSIONS.ROLES_ASSIGN)
  updateRoles(@Param('id') id: string, @Body() dto: UpdateUserRolesDto) {
    return this.userService.updateRoles(id, dto.roleIds);
  }

  /**
   * DELETE /users/:id/roles/:roleId
   *
   * Remove one role.
   */
  @Delete(':id/roles/:roleId')
  @RequirePermission(PERMISSIONS.ROLES_ASSIGN)
  removeRole(@Param('id') id: string, @Param('roleId') roleId: string) {
    return this.userService.removeRole(id, roleId);
  }
}
