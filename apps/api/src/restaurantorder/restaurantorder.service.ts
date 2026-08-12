import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  PaymentStatus,
  Prisma,
  RestaurantOrderStatus,
  RestaurantPaymentStatus,
  RestaurantSettlementMethod,
} from '../../generated/prisma';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRestaurantOrderDto } from './dto/create-restaurantorder.dto';
import { GetRestaurantOrdersDto } from './dto/get-restaurantorders.dto';
import { PayRestaurantOrderDto } from './dto/pay-restaurantorder.dto';
import { RefundRestaurantOrderDto } from './dto/refund-restaurantorder.dto';

@Injectable()
export class RestaurantorderService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: CreateRestaurantOrderDto, userId: string) {
    return this.prismaService.$transaction(async (tx) => {
      // 1. Validate reservation if supplied
      let reservation;

      if (dto.reservationId) {
        reservation = await tx.reservation.findFirst({
          where: {
            id: dto.reservationId,
          },
        });

        if (!reservation) {
          throw new NotFoundException('Reservation not found');
        }
      }

      // 2. Validate guest if supplied
      if (dto.guestId) {
        const guest = await tx.guest.findUnique({
          where: {
            id: dto.guestId,
          },
        });

        if (!guest) {
          throw new NotFoundException('Guest not found');
        }
      }

      // 3. Validate waiter
      const waiter = await tx.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!waiter) {
        throw new NotFoundException('Waiter not found');
      }

      // 4. Make sure order contains items
      if (!dto.items.length) {
        throw new BadRequestException(
          'Restaurant order must contain at least one item',
        );
      }

      // 5. Prevent duplicate menuItemIds
      const menuItemIds = dto.items.map((item) => item.menuItemId);

      const uniqueMenuItemIds = new Set(menuItemIds);

      if (uniqueMenuItemIds.size !== menuItemIds.length) {
        throw new BadRequestException(
          'A menu item can only appear once in an order',
        );
      }

      // 6. Load menu items
      const menuItems = await tx.menuItem.findMany({
        where: {
          id: {
            in: menuItemIds,
          },
        },
      });

      // 7. Check that every menu item exists
      if (menuItems.length !== menuItemIds.length) {
        const foundIds = new Set(menuItems.map((item) => item.id));

        const missingIds = menuItemIds.filter((id) => !foundIds.has(id));

        throw new NotFoundException(
          `Menu item(s) not found: ${missingIds.join(', ')}`,
        );
      }

      // 8. Check availability
      // const unavailableItems = menuItems.filter((item) => !item.isAvailable);

      // if (unavailableItems.length) {
      //   throw new BadRequestException(
      //     `The following menu items are unavailable: ${unavailableItems
      //       .map((item) => item.name)
      //       .join(', ')}`,
      //   );
      // }

      // 9. Create order items using the current menu price
      const orderItems = dto.items.map((dtoItem) => {
        const menuItem = menuItems.find(
          (item) => item.id === dtoItem.menuItemId,
        )!;

        const price = new Prisma.Decimal(menuItem.price);

        const total = price.mul(dtoItem.quantity);

        return {
          menuItemId: menuItem.id,
          quantity: dtoItem.quantity,
          price,
          total,
        };
      });

      // 10. Calculate subtotal
      const subtotal = orderItems.reduce(
        (sum, item) => sum.add(item.total),
        new Prisma.Decimal(0),
      );

      // 11. Calculate tax
      const taxRate = new Prisma.Decimal(0.075); // example: 7.5%

      const tax = subtotal.mul(taxRate);

      // 12. Calculate total
      const total = subtotal.add(tax);

      // 13. Create order + items atomically
      const order = await tx.restaurantOrder.create({
        data: {
          reservationId: dto.reservationId,
          guestId: dto.guestId,
          waiterId: userId!,
          status: RestaurantOrderStatus.PENDING,

          subtotal,
          tax,
          total,

          items: {
            create: orderItems,
          },
        },

        include: {
          items: {
            include: {
              menuItem: true,
            },
          },
          reservation: true,
          guest: true,
        },
      });

      return order;
    });
  }

  async findAll(query: GetRestaurantOrdersDto) {
    const { page = 1, limit = 1000, search } = query;

    const skip = (page - 1) * limit;

    let where: any = {};

    if (search) {
      where.OR = [{ name: { contains: search, mode: 'insensitive' } }];
    }

    const [orders, total] = await this.prismaService.$transaction([
      this.prismaService.restaurantOrder.findMany({
        where: {
          ...where,
        },
        skip,
        take: +limit,
        orderBy: { createdAt: 'desc' },

        select: {
          id: true,
          status: true,
          guest: true,
          reservation: {
            include: {
              room: true,
            },
          },
          total: true,
          items: {
            include: {
              menuItem: true,
            },
          },
          paymentStatus: true,
          createdAt: true,
        },
      }),

      this.prismaService.restaurantOrder.count({ where }),
    ]);

    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  findOne(id: string) {
    return this.prismaService.restaurantOrder.findFirst({
      where: {
        id,
      },
    });
  }

  async prepare(id: string) {
    const order = await this.findOrderOrThrow(id);

    this.ensureCanPrepare(order.status);

    return this.prismaService.restaurantOrder.update({
      where: {
        id,
      },
      data: {
        status: RestaurantOrderStatus.PREPARING,
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        guest: true,
        reservation: true,
      },
    });
  }

  async serve(id: string) {
    const order = await this.findOrderOrThrow(id);

    this.ensureCanServe(order.status);

    return this.prismaService.restaurantOrder.update({
      where: {
        id,
      },
      data: {
        status: RestaurantOrderStatus.SERVED,
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        guest: true,
        reservation: true,
      },
    });
  }

  async cancel(id: string, reason?: string) {
    const order = await this.findOrderOrThrow(id);

    this.ensureCanCancel(order.status);

    return this.prismaService.restaurantOrder.update({
      where: {
        id,
      },
      data: {
        status: RestaurantOrderStatus.CANCELLED,

        // If you add cancellationReason
        // to Prisma:
        //
        cancellationReason: reason,
        cancelledAt: new Date(),
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        guest: true,
        reservation: true,
      },
    });
  }

  async complete(id: string) {
    const order = await this.findOrderOrThrow(id);

    this.ensureCanComplete(order.status);

    return this.prismaService.restaurantOrder.update({
      where: {
        id,
      },
      data: {
        status: RestaurantOrderStatus.COMPLETED,
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        guest: true,
        reservation: true,
      },
    });
  }

  async roomCharge(orderId: string) {
    return this.prismaService.$transaction(async (tx) => {
      const order = await tx.restaurantOrder.findUnique({
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
        throw new NotFoundException('Restaurant order not found');
      }

      if (!order.reservationId) {
        throw new BadRequestException(
          'Restaurant order is not linked to a reservation',
        );
      }

      if (!order.reservation?.folio) {
        throw new BadRequestException('Reservation does not have a folio');
      }

      if (
        order.paymentStatus === RestaurantPaymentStatus.PAID ||
        order.paymentStatus === RestaurantPaymentStatus.ROOM_CHARGED
      ) {
        throw new BadRequestException(
          'Restaurant order has already been settled',
        );
      }

      // Create folio debit here
      await tx.folioTransaction.create({
        data: {
          folioId: order.reservation.folio.id,
          type: 'RESTAURANT_CHARGE',
          amount: order.total,
          description: `Restaurant order ${order.id}`,

          // Example depending on your schema:
          // restaurantOrderId: order.id,
        },
      });

      return tx.restaurantOrder.update({
        where: {
          id: order.id,
        },
        data: {
          paymentStatus: RestaurantPaymentStatus.ROOM_CHARGED,
          settlementMethod: RestaurantSettlementMethod.ROOM_CHARGE,
        },
      });
    });
  }

  async pay(orderId: string, dto: PayRestaurantOrderDto) {
    return this.prismaService.$transaction(async (tx) => {
      const order = await tx.restaurantOrder.findUnique({
        where: {
          id: orderId,
        },
        include: {
          payments: true,
        },
      });

      if (!order) {
        throw new NotFoundException('Restaurant order not found');
      }

      if (order.status === RestaurantOrderStatus.CANCELLED) {
        throw new BadRequestException('Cannot pay for a cancelled order');
      }

      if (order.paymentStatus === RestaurantPaymentStatus.PAID) {
        throw new BadRequestException('Restaurant order is already fully paid');
      }

      if (order.paymentStatus === RestaurantPaymentStatus.REFUNDED) {
        throw new BadRequestException('Cannot pay for a refunded order');
      }

      const paidAmount = order.payments.reduce(
        (sum, payment) => sum + Number(payment.amount),
        0,
      );

      const remaining = Number(order.total) - paidAmount;

      if (dto.amount > remaining) {
        throw new BadRequestException(
          `Payment exceeds remaining balance of ${remaining}`,
        );
      }

      await tx.payment.create({
        data: {
          restaurantOrderId: order.id,
          amount: new Prisma.Decimal(dto.amount),
          method: dto.method,
          reference: dto.reference,
        },
      });

      const newPaidAmount = paidAmount + dto.amount;

      const paymentStatus =
        newPaidAmount >= Number(order.total)
          ? RestaurantPaymentStatus.PAID
          : RestaurantPaymentStatus.PARTIALLY_PAID;

      return tx.restaurantOrder.update({
        where: {
          id: order.id,
        },
        data: {
          paymentStatus,
          settlementMethod: RestaurantSettlementMethod.DIRECT_PAYMENT,
        },
        include: {
          payments: true,
        },
      });
    });
  }

  async refund(orderId: string, dto: RefundRestaurantOrderDto) {
    return this.prismaService.$transaction(async (tx) => {
      const order = await tx.restaurantOrder.findUnique({
        where: {
          id: orderId,
        },
        include: {
          payments: true,
        },
      });

      if (!order) {
        throw new NotFoundException('Restaurant order not found');
      }

      if (order.status === RestaurantOrderStatus.CANCELLED) {
        throw new BadRequestException('Cancelled order cannot be refunded');
      }

      const payments = order.payments.filter(
        (payment) => payment.status !== RestaurantPaymentStatus.REFUNDED,
      );

      const totalPaid = payments.reduce(
        (sum, payment) => sum + Number(payment.amount),
        0,
      );

      const totalRefunded = payments.reduce(
        (sum, payment) => sum + Number(payment.refundedAmount),
        0,
      );

      const refundableAmount = totalPaid - totalRefunded;

      if (dto.amount > refundableAmount) {
        throw new BadRequestException(
          `Refund exceeds refundable amount of ${refundableAmount}`,
        );
      }

      let remainingRefund = dto.amount;

      /**
       * Refund against existing payments.
       *
       * We refund the oldest payments first.
       */
      for (const payment of payments) {
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
            ? PaymentStatus.REFUNDED
            : PaymentStatus.PARTIALLY_REFUNDED;

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
          ? RestaurantPaymentStatus.REFUNDED
          : RestaurantPaymentStatus.PARTIALLY_REFUNDED;

      const updatedOrder = await tx.restaurantOrder.update({
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

      return updatedOrder;
    });
  }

  private async findOrderOrThrow(id: string) {
    const order = await this.prismaService.restaurantOrder.findUnique({
      where: {
        id,
      },
    });

    if (!order) {
      throw new NotFoundException('Restaurant order not found');
    }

    return order;
  }

  private ensureCanPrepare(status: RestaurantOrderStatus) {
    if (status !== RestaurantOrderStatus.PENDING) {
      throw new BadRequestException(
        `Order cannot be sent from ${status} status`,
      );
    }
  }

  private ensureCanServe(status: RestaurantOrderStatus) {
    if (status !== RestaurantOrderStatus.PREPARING) {
      throw new BadRequestException(
        `Order cannot be served from ${status} status`,
      );
    }
  }

  private ensureCanCancel(status: RestaurantOrderStatus) {
    const allowed: string[] = [
      RestaurantOrderStatus.PENDING,
      RestaurantOrderStatus.PREPARING,
    ];

    if (!allowed.includes(status)) {
      throw new BadRequestException(
        `Order cannot be cancelled from ${status} status`,
      );
    }
  }

  private ensureCanComplete(status: RestaurantOrderStatus) {
    if (status !== RestaurantOrderStatus.SERVED) {
      throw new BadRequestException(
        `Order cannot be completed from ${status} status`,
      );
    }
  }
}
