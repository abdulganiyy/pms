import { Injectable } from '@nestjs/common';
import { CreateFolioTransactionDto } from './dto/create-foliotransaction.dto';
import { UpdateFolioTransactionDto } from './dto/update-foliotransaction.dto';

@Injectable()
export class FoliotransactionService {
  create(createFoliotransactionDto: CreateFolioTransactionDto) {
    return 'This action adds a new foliotransaction';
  }

  findAll() {
    return `This action returns all foliotransaction`;
  }

  findOne(id: string) {
    return `This action returns a #${id} foliotransaction`;
  }

  update(id: string, updateFoliotransactionDto: UpdateFolioTransactionDto) {
    return `This action updates a #${id} foliotransaction`;
  }

  remove(id: string) {
    return `This action removes a #${id} foliotransaction`;
  }
}
