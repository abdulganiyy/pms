import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFolioDto } from './dto/create-folio.dto';
import { UpdateFolioDto } from './dto/update-folio.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFolioTransactionDto } from '../foliotransaction/dto/create-foliotransaction.dto';
import { Prisma } from '../../generated/prisma';
import { GetFoliosDto } from './dto/get-folios.dto';

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

  async findAll(query: GetFoliosDto) {
    const { page = 1, limit = 1000, search } = query;

    const skip = (page - 1) * limit;

    let where: any = {};

    if (search) {
      where.OR = [];
    }

    const [folios, total] = await this.prismaService.$transaction([
      this.prismaService.folioTransaction.findMany({
        where: {
          ...where,
        },
        skip,
        take: +limit,
        orderBy: {},

        select: {
          id: true,
          folio: {
            include: {
              reservation: {
                include: {
                  guest: true,
                },
              },
            },
          },
          amount: true,
          type: true,
        },
      }),

      this.prismaService.folioTransaction.count({ where }),
    ]);

    return {
      data: folios,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
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
