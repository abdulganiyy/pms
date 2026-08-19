import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { GetMenusDto } from './dto/get-menus.dto';
import { JwtGuard } from '../common/guards/jwt.guard';
import { Permissions as RequirePermission } from '../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { PERMISSIONS } from '../constants/permission.constant';

@UseGuards(JwtGuard, PermissionsGuard)
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @RequirePermission(PERMISSIONS.RESTAURANT_MENU_CREATE)
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @Get()
  @RequirePermission(PERMISSIONS.RESTAURANT_MENU_VIEW)
  findAll(@Query() query: GetMenusDto) {
    return this.menuService.findAll(query);
  }

  @Get(':id')
  @RequirePermission(PERMISSIONS.RESTAURANT_MENU_VIEW)
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(id);
  }

  @Patch(':id')
  @RequirePermission(PERMISSIONS.RESTAURANT_MENU_UPDATE)
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(id, updateMenuDto);
  }

  @Delete(':id')
  @RequirePermission(PERMISSIONS.RESTAURANT_MENU_DELETE)
  remove(@Param('id') id: string) {
    return this.menuService.remove(id);
  }
}
