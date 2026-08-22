import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  GymMembershipDuration,
  GymMembershipStatus,
  GymPaymentStatus,
  Prisma,
} from '../../generated/prisma';

import { PrismaService } from '../prisma/prisma.service';

import { CreateGymMembershipPlanDto } from './dto/create-gym-membership-plan.dto';
import { UpdateGymMembershipPlanDto } from './dto/update-gym-membership-plan.dto';
import { CreateGymMembershipDto } from './dto/create-gym-membership.dto';
import { UpdateGymMembershipStatusDto } from './dto/update-gym-membership-status.dto';
import { PayGymMembershipDto } from './dto/pay-gym-membership.dto';
import { RefundGymMembershipDto } from './dto/refund-gym-membership.dto';
import { GetMembershipsDto } from './dto/get-memberships.dto';

@Injectable()
export class GymMembershipService {
  constructor(private readonly prisma: PrismaService) {}

  async createPlan(dto: CreateGymMembershipPlanDto) {
    return this.prisma.gymMembershipPlan.create({
      data: {
        name: dto.name,
        description: dto.description,
        duration: dto.duration,
        durationValue: dto.durationValue,
        price: dto.price,
      },
    });
  }

  async findPlans() {
    return this.prisma.gymMembershipPlan.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        price: 'asc',
      },
    });
  }

  async findPlan(id: string) {
    const plan = await this.prisma.gymMembershipPlan.findUnique({
      where: { id },
    });

    if (!plan) {
      throw new NotFoundException('Gym membership plan not found');
    }

    return plan;
  }

  async updatePlan(id: string, dto: UpdateGymMembershipPlanDto) {
    await this.findPlan(id);

    return this.prisma.gymMembershipPlan.update({
      where: { id },
      data: dto,
    });
  }

  async deactivatePlan(id: string) {
    await this.findPlan(id);

    return this.prisma.gymMembershipPlan.update({
      where: { id },
      data: {
        isActive: false,
      },
    });
  }

  async createMembership(dto: CreateGymMembershipDto) {
    return this.prisma.$transaction(async (tx) => {
      const guest = await tx.guest.findUnique({
        where: {
          id: dto.guestId,
        },
      });

      if (!guest) {
        throw new NotFoundException('Guest not found');
      }

      const plan = await tx.gymMembershipPlan.findUnique({
        where: {
          id: dto.planId,
        },
      });

      if (!plan) {
        throw new NotFoundException('Gym membership type not found');
      }

      if (!plan.isActive) {
        throw new BadRequestException('Gym membership type is inactive');
      }

      let reservation: any = null;

      if (dto.reservationId) {
        reservation = await tx.reservation.findUnique({
          where: {
            id: dto.reservationId,
          },
        });

        if (!reservation) {
          throw new NotFoundException('Reservation not found');
        }

        if (reservation.guestId !== dto.guestId) {
          throw new BadRequestException(
            'Reservation does not belong to the selected guest',
          );
        }

        if (reservation.status !== 'CHECKED_IN') {
          throw new BadRequestException(
            'Gym membership can only be attached to a checked-in reservation',
          );
        }
      }

      const startDate = new Date(dto.startDate);

      if (Number.isNaN(startDate.getTime())) {
        throw new BadRequestException('Invalid membership start date');
      }

      const endDate = this.calculateEndDate(
        startDate,
        plan.duration,
        plan.durationValue,
      );

      return tx.gymMembership.create({
        data: {
          guestId: dto.guestId,

          reservationId: dto.reservationId ?? null,

          planId: dto.planId,

          status: GymMembershipStatus.PENDING,

          startDate,
          endDate,

          price: plan.price,

          paymentStatus: 'UNPAID',

          notes: dto.notes,
        },

        include: {
          guest: true,
          reservation: {
            include: {
              room: true,
            },
          },
          plan: true,
        },
      });
    });
  }

  async findAllMemberships(query: GetMembershipsDto) {
    const { page = 1, limit = 1000, search } = query;

    const skip = (page - 1) * limit;

    let where: any = {};

    if (search) {
      where.OR = [];
    }

    const [gymMemberships, total] = await this.prisma.$transaction([
      this.prisma.gymMembership.findMany({
        where: {
          ...where,
        },
        skip,
        take: +limit,

        include: {
          guest: true,
          plan: true,
        },

        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.gymMembership.count({ where }),
    ]);

    return {
      data: gymMemberships,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findMembership(id: string) {
    const membership = await this.prisma.gymMembership.findUnique({
      where: {
        id,
      },

      include: {
        guest: true,
        plan: true,
      },
    });

    if (!membership) {
      throw new NotFoundException('Gym membership not found');
    }

    return membership;
  }

  async activateMembership(id: string) {
    const membership = await this.findMembership(id);

    if (membership.status !== GymMembershipStatus.PENDING) {
      throw new BadRequestException(
        'Only pending memberships can be activated',
      );
    }

    return this.prisma.gymMembership.update({
      where: { id },

      data: {
        status: GymMembershipStatus.ACTIVE,
        activatedAt: new Date(),
      },

      include: {
        guest: true,
        plan: true,
      },
    });
  }

  async suspendMembership(id: string) {
    const membership = await this.findMembership(id);

    if (membership.status !== GymMembershipStatus.ACTIVE) {
      throw new BadRequestException('Only active memberships can be suspended');
    }

    return this.prisma.gymMembership.update({
      where: { id },

      data: {
        status: GymMembershipStatus.SUSPENDED,
        suspendedAt: new Date(),
      },
    });
  }

  async cancelMembership(id: string, dto: UpdateGymMembershipStatusDto) {
    const membership = await this.findMembership(id);

    if (membership.status === GymMembershipStatus.CANCELLED) {
      throw new BadRequestException('Membership is already cancelled');
    }

    return this.prisma.gymMembership.update({
      where: { id },

      data: {
        status: GymMembershipStatus.CANCELLED,
        cancelledAt: new Date(),
        notes: dto.reason
          ? `${membership.notes ?? ''}\nCancellation: ${dto.reason}`
          : membership.notes,
      },
    });
  }

  async reactivateMembership(id: string) {
    const membership = await this.findMembership(id);

    if (membership.status !== GymMembershipStatus.SUSPENDED) {
      throw new BadRequestException(
        'Only suspended memberships can be reactivated',
      );
    }

    return this.prisma.gymMembership.update({
      where: { id },

      data: {
        status: GymMembershipStatus.ACTIVE,
        suspendedAt: null,
      },
    });
  }

  async roomCharge(membershipId: string) {
    return this.prisma.$transaction(async (tx) => {
      const membership = await tx.gymMembership.findUnique({
        where: {
          id: membershipId,
        },
        include: {
          reservation: {
            include: {
              folio: true,
            },
          },
        },
      });

      if (!membership) {
        throw new NotFoundException('Gym membership not found');
      }

      if (!membership.reservationId) {
        throw new BadRequestException(
          'Gym membership is not linked to a reservation',
        );
      }

      if (!membership.reservation?.folio) {
        throw new BadRequestException('Reservation does not have a folio');
      }

      if (
        membership.paymentStatus === GymPaymentStatus.PAID ||
        membership.paymentStatus === GymPaymentStatus.ROOM_CHARGED
      ) {
        throw new BadRequestException(
          'Gym membership has already been settled',
        );
      }

      if (membership.status === GymMembershipStatus.CANCELLED) {
        throw new BadRequestException(
          'Cannot charge a cancelled gym membership',
        );
      }

      await tx.folioTransaction.create({
        data: {
          folioId: membership.reservation.folio.id,
          type: 'GYM_CHARGE',
          amount: membership.price,
          description: `Gym membership ${membership.id}`,
        },
      });

      return tx.gymMembership.update({
        where: {
          id: membership.id,
        },
        data: {
          paymentStatus: GymPaymentStatus.ROOM_CHARGED,
        },
        include: {
          payments: true,
        },
      });
    });
  }

  async pay(membershipId: string, dto: PayGymMembershipDto) {
    return this.prisma.$transaction(async (tx) => {
      const membership = await tx.gymMembership.findUnique({
        where: {
          id: membershipId,
        },
        include: {
          payments: true,
        },
      });

      if (!membership) {
        throw new NotFoundException('Gym membership not found');
      }

      if (membership.status === GymMembershipStatus.CANCELLED) {
        throw new BadRequestException(
          'Cannot pay for a cancelled gym membership',
        );
      }

      if (membership.paymentStatus === GymPaymentStatus.PAID) {
        throw new BadRequestException('Gym membership is already fully paid');
      }

      if (membership.paymentStatus === GymPaymentStatus.REFUNDED) {
        throw new BadRequestException(
          'Cannot pay for a refunded gym membership',
        );
      }

      if (membership.paymentStatus === GymPaymentStatus.ROOM_CHARGED) {
        throw new BadRequestException(
          'Gym membership has already been charged to the room',
        );
      }

      const paidAmount = membership.payments.reduce(
        (sum, payment) => sum + Number(payment.amount),
        0,
      );

      const remaining = Number(membership.price) - paidAmount;

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
          gymMembershipId: membership.id,
          amount: new Prisma.Decimal(dto.amount),
          method: dto.method,
          reference: dto.reference,
        },
      });

      const newPaidAmount = paidAmount + dto.amount;

      const paymentStatus =
        newPaidAmount >= Number(membership.price)
          ? GymPaymentStatus.PAID
          : GymPaymentStatus.PARTIALLY_PAID;

      return tx.gymMembership.update({
        where: {
          id: membership.id,
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

  async refund(membershipId: string, dto: RefundGymMembershipDto) {
    return this.prisma.$transaction(async (tx) => {
      const membership = await tx.gymMembership.findUnique({
        where: {
          id: membershipId,
        },
        include: {
          payments: {
            include: {
              refunds: true,
            },
          },
        },
      });

      if (!membership) {
        throw new NotFoundException('Gym membership not found');
      }

      if (membership.status === GymMembershipStatus.CANCELLED) {
        throw new BadRequestException(
          'Cancelled gym membership cannot be refunded',
        );
      }

      if (membership.paymentStatus === GymPaymentStatus.ROOM_CHARGED) {
        throw new BadRequestException(
          'Room-charged gym memberships should be adjusted through the folio',
        );
      }

      const payments = membership.payments.filter(
        (payment) => payment.status !== 'REFUNDED',
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
          ? GymPaymentStatus.REFUNDED
          : GymPaymentStatus.PARTIALLY_PAID;

      return tx.gymMembership.update({
        where: {
          id: membership.id,
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

  private calculateEndDate(
    startDate: Date,
    duration: GymMembershipDuration,
    value: number,
  ) {
    const endDate = new Date(startDate);

    switch (duration) {
      case GymMembershipDuration.DAILY:
        endDate.setDate(endDate.getDate() + value);
        break;

      case GymMembershipDuration.WEEKLY:
        endDate.setDate(endDate.getDate() + value * 7);
        break;

      case GymMembershipDuration.MONTHLY:
        endDate.setMonth(endDate.getMonth() + value);
        break;

      case GymMembershipDuration.QUARTERLY:
        endDate.setMonth(endDate.getMonth() + value * 3);
        break;

      case GymMembershipDuration.YEARLY:
        endDate.setFullYear(endDate.getFullYear() + value);
        break;
    }

    return endDate;
  }
}
