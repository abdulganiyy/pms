import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FoliotransactionService } from './foliotransaction.service';
import { CreateFolioTransactionDto } from './dto/create-foliotransaction.dto';
import { UpdateFolioTransactionDto } from './dto/update-foliotransaction.dto';

@Controller('foliotransaction')
export class FoliotransactionController {
  constructor(
    private readonly foliotransactionService: FoliotransactionService,
  ) {}

  @Post()
  create(@Body() createFoliotransactionDto: CreateFolioTransactionDto) {
    return this.foliotransactionService.create(createFoliotransactionDto);
  }

  @Get()
  findAll() {
    return this.foliotransactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foliotransactionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFoliotransactionDto: UpdateFolioTransactionDto,
  ) {
    return this.foliotransactionService.update(id, updateFoliotransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.foliotransactionService.remove(id);
  }
}
