import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetPaymentsDto } from './dto/get-payments.dto';

@Injectable()
export class PaymentService {
  constructor(private prismaService: PrismaService) {}

  async findAll(query: GetPaymentsDto) {
    const { page = 1, limit = 1000, search } = query;

    const skip = (page - 1) * limit;

    let where: any = {};

    if (search) {
      where.OR = [{ name: { contains: search, mode: 'insensitive' } }];
    }

    const [payments, total] = await this.prismaService.$transaction([
      this.prismaService.payment.findMany({
        where: {
          ...where,
        },
        skip,
        take: +limit,
        orderBy: {},

        select: {
          id: true,
          folio: true,
          amount: true,
          status: true,
          method: true,
        },
      }),

      this.prismaService.payment.count({ where }),
    ]);

    return {
      data: payments,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
