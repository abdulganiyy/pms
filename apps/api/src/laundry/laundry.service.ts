import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  LaundryOrderStatus,
  LaundryPaymentStatus,
  Prisma,
} from '../../generated/prisma';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLaundryItemDto } from './dto/create-laundry-item.dto';
import { UpdateLaundryItemDto } from './dto/update-laundry-item.dto';
import { CreateLaundryOrderDto } from './dto/create-laundry-order.dto';
import { UpdateLaundryOrderStatusDto } from './dto/update-laundry-order-status.dto';
import { PayLaundryOrderDto } from './dto/pay-laundry-order.dto';
import { RefundLaundryOrderDto } from './dto/refund-laundry-order.dto';
import { GetLaundryOrdersDto } from './dto/get-laundry-orders.dto';

@Injectable()
export class LaundryService {
  constructor(private readonly prisma: PrismaService) {}

  async createItem(dto: CreateLaundryItemDto) {
    return this.prisma.laundryItem.create({
      data: {
        name: dto.name,
        description: dto.description,
        type: dto.type,
        price: dto.price,
      },
    });
  }

  async findItems() {
    return this.prisma.laundryItem.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findItem(id: string) {
    const item = await this.prisma.laundryItem.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException('Laundry item not found');
    }

    return item;
  }

  async updateItem(id: string, dto: UpdateLaundryItemDto) {
    await this.findItem(id);

    return this.prisma.laundryItem.update({
      where: { id },
      data: dto,
    });
  }

  async deactivateItem(id: string) {
    await this.findItem(id);

    return this.prisma.laundryItem.update({
      where: { id },
      data: {
        isActive: false,
      },
    });
  }

  async createOrder(dto: CreateLaundryOrderDto) {
    if (!dto.items?.length) {
      throw new BadRequestException(
        'Laundry order must contain at least one item',
      );
    }

    const guest = await this.prisma.guest.findUnique({
      where: { id: dto.guestId },
    });

    if (!guest) {
      throw new NotFoundException('Guest not found');
    }

    if (dto.reservationId) {
      const reservation = await this.prisma.reservation.findUnique({
        where: { id: dto.reservationId },
      });

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }
    }

    if (dto.folioId) {
      const folio = await this.prisma.folio.findUnique({
        where: { id: dto.folioId },
      });

      if (!folio) {
        throw new NotFoundException('Folio not found');
      }
    }

    const itemIds = dto.items.map((item) => item.laundryItemId);

    const laundryItems = await this.prisma.laundryItem.findMany({
      where: {
        id: {
          in: itemIds,
        },
        isActive: true,
      },
    });

    if (laundryItems.length !== new Set(itemIds).size) {
      throw new BadRequestException(
        'One or more laundry items are invalid or inactive',
      );
    }

    const itemMap = new Map(laundryItems.map((item) => [item.id, item]));

    let subtotal = 0;

    const orderItems = dto.items.map((input) => {
      const catalogItem = itemMap.get(input.laundryItemId)!;

      const unitPrice = Number(catalogItem.price);
      const total = unitPrice * input.quantity;

      subtotal += total;

      return {
        laundryItemId: catalogItem.id,
        name: catalogItem.name,
        quantity: input.quantity,
        unitPrice,
        total,
      };
    });

    const tax = 0;
    const total = subtotal + tax;

    return this.prisma.laundryOrder.create({
      data: {
        guestId: dto.guestId,
        reservationId: dto.reservationId,
        folioId: dto.folioId,

        notes: dto.notes,

        subtotal,
        tax,
        total,

        status: LaundryOrderStatus.PENDING,

        items: {
          create: orderItems,
        },
      },

      include: {
        items: true,
        guest: true,
      },
    });
  }

  async findAllOrders(query: GetLaundryOrdersDto) {
    const { page = 1, limit = 1000, search } = query;

    const skip = (page - 1) * limit;

    let where: any = {};

    if (search) {
      where.OR = [];
    }

    const [laundryOrders, total] = await this.prisma.$transaction([
      this.prisma.laundryOrder.findMany({
        where: {
          ...where,
        },
        skip,
        take: +limit,
        orderBy: { createdAt: 'desc' },

        include: {
          guest: true,
          reservation: {
            include: {
              room: true,
            },
          },
          folio: true,
          items: {
            include: {
              laundryItem: true,
            },
          },
        },

        // orderBy: {
        //   createdAt: 'desc',
        // },
      }),

      this.prisma.laundryOrder.count({ where }),
    ]);

    return {
      data: laundryOrders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOrder(id: string) {
    const order = await this.prisma.laundryOrder.findUnique({
      where: { id },

      include: {
        guest: true,
        reservation: true,
        folio: true,

        items: {
          include: {
            laundryItem: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Laundry order not found');
    }

    return order;
  }

  async updateStatus(id: string, dto: UpdateLaundryOrderStatusDto) {
    const order = await this.findOrder(id);

    this.validateStatusTransition(order.status, dto.status);

    const now = new Date();

    const data: any = {
      status: dto.status,
    };

    switch (dto.status) {
      case LaundryOrderStatus.RECEIVED:
        data.receivedAt = now;
        break;

      case LaundryOrderStatus.READY:
        data.readyAt = now;
        break;

      case LaundryOrderStatus.DELIVERED:
        data.deliveredAt = now;
        break;

      case LaundryOrderStatus.CANCELLED:
        data.cancelledAt = now;
        break;
    }

    return this.prisma.laundryOrder.update({
      where: { id },
      data,

      include: {
        items: true,
        guest: true,
      },
    });
  }

  async roomCharge(orderId: string) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.laundryOrder.findUnique({
        where: {
          id: orderId,
        },
        include: {
          reservation: {
            include: {
              folio: true,
            },
          },
        },
      });

      if (!order) {
        throw new NotFoundException('Laundry order not found');
      }

      if (!order.reservationId) {
        throw new BadRequestException(
          'Laundry order is not linked to a reservation',
        );
      }

      if (!order.reservation?.folio) {
        throw new BadRequestException('Reservation does not have a folio');
      }

      if (
        order.paymentStatus === LaundryPaymentStatus.PAID ||
        order.paymentStatus === LaundryPaymentStatus.ROOM_CHARGED
      ) {
        throw new BadRequestException('Laundry order has already been settled');
      }

      if (order.status === LaundryOrderStatus.CANCELLED) {
        throw new BadRequestException(
          'Cannot charge a cancelled laundry order',
        );
      }

      await tx.folioTransaction.create({
        data: {
          folioId: order.reservation.folio.id,
          type: 'LAUNDRY_CHARGE',
          amount: order.total,
          description: `Laundry order ${order.id}`,
        },
      });

      return tx.laundryOrder.update({
        where: {
          id: order.id,
        },
        data: {
          paymentStatus: LaundryPaymentStatus.ROOM_CHARGED,
        },
      });
    });
  }

  async pay(orderId: string, dto: PayLaundryOrderDto) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.laundryOrder.findUnique({
        where: {
          id: orderId,
        },
        include: {
          payments: true,
        },
      });

      if (!order) {
        throw new NotFoundException('Laundry order not found');
      }

      if (order.status === LaundryOrderStatus.CANCELLED) {
        throw new BadRequestException(
          'Cannot pay for a cancelled laundry order',
        );
      }

      if (order.paymentStatus === LaundryPaymentStatus.PAID) {
        throw new BadRequestException('Laundry order is already fully paid');
      }

      if (order.paymentStatus === LaundryPaymentStatus.REFUNDED) {
        throw new BadRequestException(
          'Cannot pay for a refunded laundry order',
        );
      }

      if (order.paymentStatus === LaundryPaymentStatus.ROOM_CHARGED) {
        throw new BadRequestException(
          'Laundry order has already been charged to the room',
        );
      }

      const paidAmount = order.payments.reduce(
        (sum, payment) => sum + Number(payment.amount),
        0,
      );

      const remaining = Number(order.total) - paidAmount;

      if (dto.amount <= 0) {
        throw new BadRequestException(
          'Payment amount must be greater than zero',
        );
      }

      if (dto.amount > remaining) {
        throw new BadRequestException(
          `Payment exceeds remaining balance of ${remaining}`,
        );
      }

      await tx.payment.create({
        data: {
          laundryOrderId: order.id,
          amount: new Prisma.Decimal(dto.amount),
          method: dto.method,
          reference: dto.reference,
        },
      });

      const newPaidAmount = paidAmount + dto.amount;

      const paymentStatus =
        newPaidAmount >= Number(order.total)
          ? LaundryPaymentStatus.PAID
          : LaundryPaymentStatus.PARTIALLY_PAID;

      return tx.laundryOrder.update({
        where: {
          id: order.id,
        },
        data: {
          paymentStatus,
        },
        include: {
          payments: true,
        },
      });
    });
  }

  async refund(orderId: string, dto: RefundLaundryOrderDto) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.laundryOrder.findUnique({
        where: {
          id: orderId,
        },
        include: {
          payments: {
            include: {
              refunds: true,
            },
          },
        },
      });

      if (!order) {
        throw new NotFoundException('Laundry order not found');
      }

      if (order.status === LaundryOrderStatus.CANCELLED) {
        throw new BadRequestException(
          'Cancelled laundry order cannot be refunded',
        );
      }

      if (order.paymentStatus === LaundryPaymentStatus.ROOM_CHARGED) {
        throw new BadRequestException(
          'Room-charged laundry orders should be adjusted through the folio',
        );
      }

      const validPayments = order.payments.filter(
        (payment) => payment.status !== 'REFUNDED',
      );

      const totalPaid = validPayments.reduce(
        (sum, payment) => sum + Number(payment.amount),
        0,
      );

      const totalRefunded = validPayments.reduce(
        (sum, payment) => sum + Number(payment.refundedAmount),
        0,
      );

      const refundableAmount = totalPaid - totalRefunded;

      if (dto.amount <= 0) {
        throw new BadRequestException(
          'Refund amount must be greater than zero',
        );
      }

      if (dto.amount > refundableAmount) {
        throw new BadRequestException(
          `Refund exceeds refundable amount of ${refundableAmount}`,
        );
      }

      let remainingRefund = dto.amount;

      for (const payment of validPayments) {
        if (remainingRefund <= 0) {
          break;
        }

        const alreadyRefunded = Number(payment.refundedAmount);

        const available = Number(payment.amount) - alreadyRefunded;

        if (available <= 0) {
          continue;
        }

        const refundAmount = Math.min(available, remainingRefund);

        await tx.paymentRefund.create({
          data: {
            paymentId: payment.id,
            amount: new Prisma.Decimal(refundAmount),
            reason: dto.reason,
          },
        });

        const newRefundedAmount = alreadyRefunded + refundAmount;

        const paymentStatus =
          newRefundedAmount >= Number(payment.amount)
            ? 'REFUNDED'
            : 'PARTIALLY_REFUNDED';

        await tx.payment.update({
          where: {
            id: payment.id,
          },
          data: {
            refundedAmount: new Prisma.Decimal(newRefundedAmount),
            status: paymentStatus,
          },
        });

        remainingRefund -= refundAmount;
      }

      const newTotalRefunded = totalRefunded + dto.amount;

      const newPaymentStatus =
        newTotalRefunded >= totalPaid
          ? LaundryPaymentStatus.REFUNDED
          : LaundryPaymentStatus.PARTIALLY_PAID;

      return tx.laundryOrder.update({
        where: {
          id: order.id,
        },
        data: {
          paymentStatus: newPaymentStatus,
        },
        include: {
          payments: {
            include: {
              refunds: true,
            },
          },
        },
      });
    });
  }

  private validateStatusTransition(
    current: LaundryOrderStatus,
    next: LaundryOrderStatus,
  ) {
    if (current === LaundryOrderStatus.CANCELLED) {
      throw new BadRequestException(
        'Cancelled laundry orders cannot be changed',
      );
    }

    if (current === LaundryOrderStatus.DELIVERED) {
      throw new BadRequestException(
        'Delivered laundry orders cannot be changed',
      );
    }

    const allowed: Record<LaundryOrderStatus, LaundryOrderStatus[]> = {
      PENDING: [LaundryOrderStatus.RECEIVED, LaundryOrderStatus.CANCELLED],

      RECEIVED: [LaundryOrderStatus.PROCESSING, LaundryOrderStatus.CANCELLED],

      PROCESSING: [LaundryOrderStatus.READY, LaundryOrderStatus.CANCELLED],

      READY: [LaundryOrderStatus.DELIVERED],

      DELIVERED: [],

      CANCELLED: [],
    };

    if (!allowed[current].includes(next)) {
      throw new BadRequestException(
        `Cannot change laundry order from ${current} to ${next}`,
      );
    }
  }
}
