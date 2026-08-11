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
import { FolioService } from './folio.service';
import { CreateFolioDto } from './dto/create-folio.dto';
import { UpdateFolioDto } from './dto/update-folio.dto';
import { CreateFolioTransactionDto } from '../foliotransaction/dto/create-foliotransaction.dto';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from '../../generated/prisma';

@UseGuards(JwtGuard, RolesGuard)
@Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN, RoleName.USER)
@Controller('folio')
export class FolioController {
  constructor(private readonly folioService: FolioService) {}

  @Post(':folioId/transaction')
  createTransaction(
    @Param('folioId') folioId: string,
    @Body() dto: CreateFolioTransactionDto,
  ) {
    return this.folioService.createTransaction(folioId, dto);
  }

  @Post()
  create(@Body() createFolioDto: CreateFolioDto) {
    return this.folioService.create(createFolioDto);
  }

  @Get()
  findAll() {
    return this.folioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.folioService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFolioDto: UpdateFolioDto) {
    return this.folioService.update(id, updateFolioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.folioService.remove(id);
  }
}
