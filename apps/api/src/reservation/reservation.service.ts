import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { PrismaService } from '../prisma/prisma.service';
import {
  FolioTransactionType,
  Prisma,
  Reservation,
} from '../../generated/prisma';
import {
  ReservationAuditAction,
  ReservationStatus,
} from '../../generated/prisma';
import { ChangeReservationRoomDto } from './dto/change-reservation-room.dto';
import { GetReservationsDto } from './dto/get-reservations.dto';

type ReservationWithFolio = Prisma.ReservationGetPayload<{
  include: {
    folio: true;
  };
}>;

@Injectable()
export class ReservationService {
  constructor(private prismaService: PrismaService) {}

  async create(dto: CreateReservationDto, userId?: string) {
    const checkIn = new Date(dto.checkIn);
    const checkOut = new Date(dto.checkOut);

    this.validateDates(checkIn, checkOut);

    return this.prismaService.$transaction(async (tx) => {
      const room = await tx.room.findUnique({
        where: {
          id: dto.roomId,
        },
      });

      if (!room) {
        throw new NotFoundException('Room not found');
      }

      if (room.status === 'OUT_OF_ORDER') {
        throw new BadRequestException('Room is out of order');
      }

      await this.ensureRoomAvailable(tx, dto.roomId, checkIn, checkOut);

      const roomRate = dto.roomRateId
        ? await tx.roomRate.findUnique({
            where: {
              id: dto.roomRateId,
            },
          })
        : null;

      if (dto.roomRateId && !roomRate) {
        throw new NotFoundException('Room rate not found');
      }

      const nights = this.calculateNights(checkIn, checkOut);

      const nightlyRate = roomRate?.price ?? 0;

      const subtotal = Number(nightlyRate) * nights;

      const tax = 0;

      const totalAmount = subtotal + tax;

      const reservation = await tx.reservation.create({
        data: {
          guestId: dto.guestId,
          roomId: dto.roomId,
          roomRateId: dto.roomRateId,

          checkIn,
          checkOut,

          adults: dto.adults ?? 1,
          children: dto.children ?? 0,

          nightlyRate,

          totalAmount,
          type: dto.type,
          status: ReservationStatus.CONFIRMED,
        },
      });

      // 2. Create folio
      const folio = await tx.folio.create({
        data: {
          reservationId: reservation.id,
        },
      });

      await tx.reservationAudit.create({
        data: {
          reservationId: reservation.id,
          action: ReservationAuditAction.CREATED,
          performedById: userId,
          newValues: reservation as any,
          // folioId: folio.id,
        },
      });

      return reservation;
    });
  }

  async findAll(query: GetReservationsDto) {
    const { page = 1, limit = 1000, search } = query;

    const skip = (page - 1) * limit;

    let where: any = {};

    if (search) {
      where.OR = [];
    }

    const [reservations, total] = await this.prismaService.$transaction([
      this.prismaService.reservation.findMany({
        where: {
          ...where,
        },
        skip,
        take: +limit,
        orderBy: { createdAt: 'desc' },

        select: {
          id: true,
          guest: true,
          room: true,
        },
      }),

      this.prismaService.reservation.count({ where }),
    ]);

    return {
      data: reservations,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  findOne(id: string) {
    return this.prismaService.reservation.findFirst({ where: { id } });
  }

  async update(id: string, dto: UpdateReservationDto, userId?: string) {
    return this.prismaService.$transaction(async (tx) => {
      const reservation = await tx.reservation.findUnique({
        where: { id },
      });

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      this.ensureCanEdit(reservation.status);

      const updated = await tx.reservation.update({
        where: { id },
        data: {
          adults: dto.adults,
          children: dto.children,
        },
      });

      await tx.reservationAudit.create({
        data: {
          reservationId: id,
          action: ReservationAuditAction.UPDATED,
          performedById: userId,

          oldValues: {
            adults: reservation.adults,
            children: reservation.children,
          },

          newValues: {
            adults: updated.adults,
            children: updated.children,
          },
        },
      });

      return updated;
    });
  }

  async cancel(id: string, reason?: string, userId?: string) {
    return this.prismaService.$transaction(async (tx) => {
      const reservation = await tx.reservation.findUnique({
        where: { id },
      });

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      if (reservation.status === ReservationStatus.CANCELLED) {
        throw new BadRequestException('Reservation is already cancelled');
      }

      if (reservation.status === ReservationStatus.CHECKED_IN) {
        throw new BadRequestException(
          'Checked-in reservations cannot be cancelled. Check out the guest instead.',
        );
      }

      if (reservation.status === ReservationStatus.CHECKED_OUT) {
        throw new BadRequestException(
          'Checked-out reservations cannot be cancelled',
        );
      }

      if (reservation.status === ReservationStatus.NO_SHOW) {
        throw new BadRequestException(
          'No-show reservation cannot be cancelled',
        );
      }

      const updated = await tx.reservation.update({
        where: { id },

        data: {
          status: ReservationStatus.CANCELLED,

          cancelledAt: new Date(),

          cancelledById: userId,

          cancellationReason: reason,
        },
      });

      await tx.reservationAudit.create({
        data: {
          reservationId: id,
          action: ReservationAuditAction.CANCELLED,
          performedById: userId,
          reason,

          oldValues: {
            status: reservation.status,
          },

          newValues: {
            status: ReservationStatus.CANCELLED,
            cancellationReason: reason,
          },
        },
      });

      return updated;
    });
  }

  async checkIn(id: string, userId?: string) {
    return this.prismaService.$transaction(async (tx) => {
      const reservation = await tx.reservation.findUnique({
        where: { id },
        include: {
          room: true,
          folio: true,
        },
      });

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      if (reservation.status !== ReservationStatus.CONFIRMED) {
        throw new BadRequestException(
          `Reservation cannot be checked in from ${reservation.status} status`,
        );
      }

      if (reservation.room.status === 'OUT_OF_ORDER') {
        throw new BadRequestException('Room is out of order');
      }

      const now = new Date();

      const updated = await tx.reservation.update({
        where: { id },

        data: {
          status: ReservationStatus.CHECKED_IN,

          checkedInAt: now,
        },
      });

      await this.postRoomCharge(tx, reservation);

      await tx.reservationAudit.create({
        data: {
          reservationId: id,

          action: ReservationAuditAction.CHECKED_IN,

          performedById: userId,

          oldValues: {
            status: reservation.status,
          },

          newValues: {
            status: ReservationStatus.CHECKED_IN,

            checkedInAt: now,
          },
        },
      });

      return updated;
    });
  }

  async checkOut(id: string, userId?: string) {
    return this.prismaService.$transaction(async (tx) => {
      const reservation = await tx.reservation.findUnique({
        where: { id },
      });

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      if (reservation.status !== ReservationStatus.CHECKED_IN) {
        throw new BadRequestException(
          'Only checked-in reservations can be checked out',
        );
      }

      const now = new Date();

      const updated = await tx.reservation.update({
        where: { id },

        data: {
          status: ReservationStatus.CHECKED_OUT,

          checkedOutAt: now,
        },
      });

      await tx.reservationAudit.create({
        data: {
          reservationId: id,

          action: ReservationAuditAction.CHECKED_OUT,

          performedById: userId,

          oldValues: {
            status: ReservationStatus.CHECKED_IN,
          },

          newValues: {
            status: ReservationStatus.CHECKED_OUT,

            checkedOutAt: now,
          },
        },
      });

      return updated;
    });
  }

  async noShow(id: string, userId?: string) {
    return this.prismaService.$transaction(async (tx) => {
      const reservation = await tx.reservation.findUnique({
        where: { id },
      });

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      if (reservation.status !== ReservationStatus.CONFIRMED) {
        throw new BadRequestException(
          'Only confirmed reservations can be marked as no-show',
        );
      }

      const now = new Date();

      const updated = await tx.reservation.update({
        where: { id },

        data: {
          status: ReservationStatus.NO_SHOW,

          noShowAt: now,
        },
      });

      await tx.reservationAudit.create({
        data: {
          reservationId: id,

          action: ReservationAuditAction.NO_SHOW,

          performedById: userId,

          oldValues: {
            status: reservation.status,
          },

          newValues: {
            status: ReservationStatus.NO_SHOW,

            noShowAt: now,
          },
        },
      });

      return updated;
    });
  }

  async changeRoom(id: string, dto: ChangeReservationRoomDto, userId?: string) {
    return this.prismaService.$transaction(async (tx) => {
      const reservation = await tx.reservation.findUnique({
        where: { id },
        include: {
          room: {
            include: {
              roomType: true,
            },
          },
          roomRate: true,
        },
      });

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      this.ensureCanChangeRoom(reservation.status);

      const newRoom = await tx.room.findUnique({
        where: {
          id: dto.roomId,
        },
        include: {
          roomType: true,
        },
      });

      if (!newRoom) {
        throw new NotFoundException('New room not found');
      }

      if (newRoom.status === 'OUT_OF_ORDER') {
        throw new BadRequestException('New room is out of order');
      }

      await this.ensureRoomAvailable(
        tx,
        newRoom.id,
        reservation.checkIn,
        reservation.checkOut,
        reservation.id,
      );

      const sameRoomType = newRoom.roomTypeId === reservation.room.roomTypeId;

      let newRoomRate = reservation.roomRate;

      if (!sameRoomType) {
        if (!dto.roomRateId) {
          throw new BadRequestException(
            'A room rate is required when changing room type',
          );
        }

        newRoomRate = await tx.roomRate.findUniqueOrThrow({
          where: {
            id: dto.roomRateId,
          },
        });

        if (!newRoomRate) {
          throw new NotFoundException('Room rate not found');
        }

        if (newRoomRate.roomTypeId !== newRoom.roomTypeId) {
          throw new BadRequestException(
            'Room rate does not belong to the new room type',
          );
        }
      }

      const nights = this.calculateNights(
        reservation.checkIn,
        reservation.checkOut,
      );

      const newNightlyRate = Number(newRoomRate?.price ?? 0);

      const newSubtotal = newNightlyRate * nights;

      const newTax = 0;

      const newTotal = newSubtotal + newTax;

      const priceDifference = newTotal - Number(reservation.totalAmount);

      const updated = await tx.reservation.update({
        where: {
          id,
        },
        data: {
          room: {
            connect: {
              id: newRoom.id,
            },
          },

          ...(newRoomRate
            ? {
                roomRate: {
                  connect: {
                    id: newRoomRate.id,
                  },
                },

                nightlyRate: newNightlyRate,
                totalAmount: newTotal,
              }
            : {}),
        },
      });

      await tx.reservationAudit.create({
        data: {
          reservationId: id,

          action: ReservationAuditAction.ROOM_CHANGED,

          performedById: userId,

          oldValues: {
            roomId: reservation.roomId,

            roomRateId: reservation.roomRateId,

            totalAmount: reservation.totalAmount,
          },

          newValues: {
            roomId: newRoom.id,

            roomRateId: newRoomRate?.id ?? reservation.roomRateId,

            totalAmount: newTotal,
          },
        },
      });

      return {
        reservation: updated,

        priceDifference,
      };
    });
  }

  private ensureCanChangeRoom(status: ReservationStatus): void {
    const allowedStatuses: ReservationStatus[] = [
      ReservationStatus.PENDING,
      ReservationStatus.CONFIRMED,
      ReservationStatus.CHECKED_IN,
    ];

    if (!allowedStatuses.includes(status)) {
      throw new BadRequestException(
        `Room cannot be changed when reservation status is ${status}`,
      );
    }
  }

  private async ensureRoomAvailable(
    tx: any,
    roomId: string,
    checkIn: Date,
    checkOut: Date,
    excludeReservationId?: string,
  ) {
    const conflictingReservation = await tx.reservation.findFirst({
      where: {
        roomId,

        status: {
          in: [
            ReservationStatus.PENDING,
            ReservationStatus.CONFIRMED,
            ReservationStatus.CHECKED_IN,
          ],
        },

        checkIn: {
          lt: checkOut,
        },

        checkOut: {
          gt: checkIn,
        },

        ...(excludeReservationId
          ? {
              id: {
                not: excludeReservationId,
              },
            }
          : {}),
      },
    });

    if (conflictingReservation) {
      throw new BadRequestException(
        'Room is not available for the selected dates',
      );
    }
  }

  private validateDates(checkIn: Date, checkOut: Date) {
    if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
      throw new BadRequestException('Invalid check-in or check-out date');
    }

    if (checkOut <= checkIn) {
      throw new BadRequestException('Check-out must be after check-in');
    }
  }

  private calculateNights(checkIn: Date, checkOut: Date) {
    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    return Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / millisecondsPerDay,
    );
  }

  private ensureCanEdit(status: ReservationStatus) {
    const allowed: string[] = [
      ReservationStatus.PENDING,
      ReservationStatus.CONFIRMED,
    ];

    if (!allowed.includes(status)) {
      throw new BadRequestException(
        `Reservation cannot be edited from ${status} status`,
      );
    }
  }

  private async postRoomCharge(
    tx: Prisma.TransactionClient,
    reservation: ReservationWithFolio,
  ) {
    const nights = this.calculateNights(
      reservation.checkIn,
      reservation.checkOut,
    );

    const amount = Number(reservation.nightlyRate) * nights;

    return tx.folioTransaction.create({
      data: {
        folioId: reservation.folio!.id,

        type: FolioTransactionType.ROOM_CHARGE,

        description: `Room charge - ${nights} night(s)`,

        amount,
      },
    });
  }

  remove(id: string) {
    return this.prismaService.reservation.delete({ where: { id } });
  }
}
