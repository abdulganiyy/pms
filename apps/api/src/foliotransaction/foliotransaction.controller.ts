import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FoliotransactionService } from './foliotransaction.service';
import { CreateFolioTransactionDto } from './dto/create-foliotransaction.dto';
import { UpdateFolioTransactionDto } from './dto/update-foliotransaction.dto';
import { Permissions as RequirePermission } from '../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { PERMISSIONS } from '../constants/permission.constant';
import { JwtGuard } from '../common/guards/jwt.guard';

@Controller('foliotransaction')
@UseGuards(JwtGuard, PermissionsGuard)
export class FoliotransactionController {
  constructor(
    private readonly foliotransactionService: FoliotransactionService,
  ) {}

  @Post()
  @RequirePermission(PERMISSIONS.FOLIOS_ADD_CHARGE)
  create(@Body() createFoliotransactionDto: CreateFolioTransactionDto) {
    return this.foliotransactionService.create(createFoliotransactionDto);
  }

  @Get()
  @RequirePermission(PERMISSIONS.FOLIOS_VIEW)
  findAll() {
    return this.foliotransactionService.findAll();
  }

  @Get(':id')
  @RequirePermission(PERMISSIONS.FOLIOS_VIEW)
  findOne(@Param('id') id: string) {
    return this.foliotransactionService.findOne(id);
  }

  @Patch(':id')
  @RequirePermission(PERMISSIONS.FOLIOS_ADJUST_CHARGE)
  update(
    @Param('id') id: string,
    @Body() updateFoliotransactionDto: UpdateFolioTransactionDto,
  ) {
    return this.foliotransactionService.update(id, updateFoliotransactionDto);
  }

  @Delete(':id')
  @RequirePermission(PERMISSIONS.FOLIOS_REMOVE_CHARGE)
  remove(@Param('id') id: string) {
    return this.foliotransactionService.remove(id);
  }
}
