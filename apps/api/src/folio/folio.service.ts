import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFolioDto } from './dto/create-folio.dto';
import { UpdateFolioDto } from './dto/update-folio.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFolioTransactionDto } from '../foliotransaction/dto/create-foliotransaction.dto';
import { Prisma } from '../../generated/prisma';

@Injectable()
export class FolioService {
  constructor(private prismaService: PrismaService) {}

  async createTransaction(folioId: string, dto: CreateFolioTransactionDto) {
    const folio = await this.prismaService.folio.findUnique({
      where: {
        id: folioId,
      },
    });

    if (!folio) {
      throw new NotFoundException('Folio not found');
    }

    return this.prismaService.folioTransaction.create({
      data: {
        folioId,
        type: dto.type,
        amount: new Prisma.Decimal(dto.amount),
        description: dto.description,
      },
    });
  }

  create(createFolioDto: CreateFolioDto) {
    return 'This action adds a new folio';
  }

  findAll() {
    return `This action returns all folio`;
  }

  findOne(id: string) {
    return `This action returns a #${id} folio`;
  }

  update(id: string, updateFolioDto: UpdateFolioDto) {
    return `This action updates a #${id} folio`;
  }

  remove(id: string) {
    return `This action removes a #${id} folio`;
  }
}
