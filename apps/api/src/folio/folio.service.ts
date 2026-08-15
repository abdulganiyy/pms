import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFolioDto } from './dto/create-folio.dto';
import { UpdateFolioDto } from './dto/update-folio.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFolioTransactionDto } from '../foliotransaction/dto/create-foliotransaction.dto';
import {
  PaymentStatus,
  Prisma,
  ReservationPaymentStatus,
} from '../../generated/prisma';
import { GetFoliosDto } from './dto/get-folios.dto';
import { CreateFolioPaymentDto } from './dto/create-folio-payment.dto';

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

  async getReservationFolio(reservationId: string) {
    const folio = await this.prismaService.folio.findUnique({
      where: {
        reservationId,
      },

      include: {
        reservation: {
          include: {
            guest: true,
          },
        },

        transactions: {
          orderBy: {
            createdAt: 'asc',
          },
        },

        payments: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!folio) {
      throw new NotFoundException('Folio not found for reservation');
    }

    return this.buildFolioResponse(folio);
  }

  async createPayment(reservationId: string, dto: CreateFolioPaymentDto) {
    return this.prismaService.$transaction(async (tx) => {
      const folio = await tx.folio.findUnique({
        where: {
          reservationId,
        },

        include: {
          reservation: true,

          transactions: true,

          payments: {
            where: {
              status: {
                in: [PaymentStatus.COMPLETED, PaymentStatus.PARTIALLY_REFUNDED],
              },
            },
          },
        },
      });

      if (!folio) {
        throw new NotFoundException('Folio not found for reservation');
      }

      /**
       * Don't allow payments for cancelled reservations.
       */
      if (folio.reservation.status === 'CANCELLED') {
        throw new BadRequestException(
          'Cannot make payment for a cancelled reservation',
        );
      }

      const amount = new Prisma.Decimal(dto.amount);

      if (amount.lte(0)) {
        throw new BadRequestException(
          'Payment amount must be greater than zero',
        );
      }

      /**
       * Calculate folio balance.
       */
      const balance = this.calculateBalance(folio.transactions, folio.payments);

      if (amount.gt(balance)) {
        throw new BadRequestException(
          `Payment exceeds outstanding balance of ${balance.toString()}`,
        );
      }

      /**
       * Create payment.
       */
      const payment = await tx.payment.create({
        data: {
          folioId: folio.id,

          amount,

          method: dto.method,

          reference: dto.reference,

          status: PaymentStatus.COMPLETED,
        },
      });

      /**
       * Recalculate balance after payment.
       */
      const newPaidAmount = this.calculatePaidAmount(folio.payments).plus(
        amount,
      );

      const totalCharges = this.calculateTransactionTotal(folio.transactions);

      const newBalance = totalCharges.minus(newPaidAmount);

      /**
       * Update reservation payment status.
       */
      const paymentStatus = this.getPaymentStatus(totalCharges, newPaidAmount);

      return {
        payment,

        summary: {
          totalCharges: totalCharges.toNumber(),

          paidAmount: newPaidAmount.toNumber(),

          balance: newBalance.toNumber(),

          paymentStatus,
        },
      };
    });
  }

  private calculateTransactionTotal(
    transactions: {
      amount: Prisma.Decimal;
    }[],
  ): Prisma.Decimal {
    return transactions.reduce(
      (total, transaction) => total.plus(transaction.amount),
      new Prisma.Decimal(0),
    );
  }

  private calculatePaidAmount(
    payments: {
      amount: Prisma.Decimal;
      refundedAmount: Prisma.Decimal;
    }[],
  ): Prisma.Decimal {
    return payments.reduce(
      (total, payment) => {
        const effectivePayment = payment.amount.minus(payment.refundedAmount);

        return total.plus(effectivePayment);
      },

      new Prisma.Decimal(0),
    );
  }

  private calculateBalance(
    transactions: {
      amount: Prisma.Decimal;
    }[],

    payments: {
      amount: Prisma.Decimal;
      refundedAmount: Prisma.Decimal;
    }[],
  ): Prisma.Decimal {
    const totalCharges = this.calculateTransactionTotal(transactions);

    const totalPaid = this.calculatePaidAmount(payments);

    return totalCharges.minus(totalPaid);
  }

  private getPaymentStatus(
    totalCharges: Prisma.Decimal,
    paidAmount: Prisma.Decimal,
  ): ReservationPaymentStatus {
    if (paidAmount.lte(0)) {
      return ReservationPaymentStatus.UNPAID;
    }

    if (paidAmount.gte(totalCharges)) {
      return ReservationPaymentStatus.PAID;
    }

    return ReservationPaymentStatus.PARTIALLY_PAID;
  }

  private buildFolioResponse(folio: any) {
    const totalCharges = this.calculateTransactionTotal(folio.transactions);

    const paidAmount = this.calculatePaidAmount(folio.payments);

    const balance = totalCharges.minus(paidAmount);

    return {
      id: folio.id,

      reservationId: folio.reservationId,

      guest: {
        id: folio.reservation.guest.id,

        firstName: folio.reservation.guest.firstName,

        lastName: folio.reservation.guest.lastName,
      },

      totalCharges: totalCharges.toNumber(),

      paidAmount: paidAmount.toNumber(),

      balance: balance.toNumber(),

      transactions: folio.transactions.map((transaction: any) => ({
        id: transaction.id,

        type: transaction.type,

        amount: transaction.amount.toNumber(),

        description: transaction.description,

        createdAt: transaction.createdAt,
      })),

      payments: folio.payments.map((payment: any) => ({
        id: payment.id,

        amount: payment.amount.toNumber(),

        refundedAmount: payment.refundedAmount.toNumber(),

        effectiveAmount: payment.amount
          .minus(payment.refundedAmount)
          .toNumber(),

        status: payment.status,

        reference: payment.reference,

        method: payment.method,

        createdAt: payment.createdAt,
      })),
    };
  }
}
