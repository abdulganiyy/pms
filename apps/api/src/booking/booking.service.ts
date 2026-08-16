import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CheckAvailabilityDto } from './dto/check-availability.dto';
import {
  Prisma,
  ReservationStatus,
  ReservationType,
} from '../../generated/prisma';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingService {
  constructor(private prismaService: PrismaService) {}

  async checKAvailability(query: CheckAvailabilityDto) {
    const { checkIn, checkOut, totalGuests } = query;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (nights <= 0) {
      throw new BadRequestException(
        'Check-out date must be after check-in date',
      );
    }

    const roomTypes = await this.prismaService.roomType.findMany({
      where: {
        maxGuests: {
          gte: +totalGuests,
        },

        rooms: {
          some: {
            status: {
              notIn: ['OUT_OF_SERVICE', 'OUT_OF_ORDER', 'BLOCKED'],
            },

            reservations: {
              none: {
                checkIn: {
                  lt: checkOutDate,
                },

                checkOut: {
                  gt: checkInDate,
                },

                status: {
                  in: ['PENDING', 'CONFIRMED', 'CHECKED_IN'],
                },
              },
            },
          },
        },
      },

      include: {
        rooms: {
          where: {
            status: {
              notIn: ['OUT_OF_SERVICE', 'OUT_OF_ORDER', 'BLOCKED'],
            },

            reservations: {
              none: {
                checkIn: {
                  lt: checkOutDate,
                },

                checkOut: {
                  gt: checkInDate,
                },

                status: {
                  in: ['PENDING', 'CONFIRMED', 'CHECKED_IN'],
                },
              },
            },
          },
        },

        rates: {
          where: {
            startDate: {
              lte: checkInDate,
            },
            endDate: {
              gte: checkOutDate,
            },
          },

          orderBy: {
            price: 'asc',
          },
          include: {
            ratePlan: true,
          },
        },
      },
    });

    return roomTypes.map((roomType) => ({
      id: roomType.id,

      name: roomType.name,

      detail: `${roomType.maxGuests} guests · ${roomType.size} m²`,

      availableRooms: roomType.rooms.length,

      rates: roomType.rates.map((rate) => ({
        id: rate.id,

        name: rate.ratePlan.name,

        pricePerNight: Number(rate.price),

        totalPrice: Number(rate.price) * nights,

        refundable: rate.ratePlan.refundable,

        breakfastIncluded: rate.ratePlan.includesBreakfast,
      })),
    }));
  }

  async createBooking(dto: CreateBookingDto) {
    const checkIn = new Date(dto.checkIn);
    const checkOut = new Date(dto.checkOut);

    if (checkOut <= checkIn) {
      throw new BadRequestException('Check-out must be after check-in');
    }

    return this.prismaService.$transaction(
      async (tx) => {
        /*
         * 1. Find the requested room type
         */
        const roomType = await tx.roomType.findUnique({
          where: {
            id: dto.roomTypeId,
          },
        });

        if (!roomType) {
          throw new NotFoundException('Room type not found');
        }

        /*
         * 2. Validate guest capacity
         */
        if (dto.totalGuests > roomType.maxGuests) {
          throw new BadRequestException(
            `This room type can accommodate a maximum of ${roomType.maxGuests} guests`,
          );
        }

        /*
         * 3. Verify that the selected rate
         *    belongs to the selected room type.
         */
        const rate = await tx.roomRate.findFirst({
          where: {
            id: dto.rateId,
            roomTypeId: dto.roomTypeId,
          },
        });

        if (!rate) {
          throw new BadRequestException(
            'Invalid rate for the selected room type',
          );
        }

        /*
         * 4. Find a physical room that:
         *
         *    - belongs to the requested room type
         *    - is currently available
         *    - has no overlapping active reservation
         */
        const room = await tx.room.findFirst({
          where: {
            roomTypeId: dto.roomTypeId,

            status: {
              notIn: ['OUT_OF_SERVICE', 'OUT_OF_ORDER', 'BLOCKED'],
            },

            reservations: {
              none: {
                checkIn: {
                  lt: checkOut,
                },

                checkOut: {
                  gt: checkIn,
                },

                status: {
                  in: [
                    ReservationStatus.PENDING,
                    ReservationStatus.CONFIRMED,
                    ReservationStatus.CHECKED_IN,
                  ],
                },
              },
            },
          },

          orderBy: {
            number: 'asc',
          },
        });

        if (!room) {
          throw new ConflictException(
            'No rooms are available for the selected dates',
          );
        }

        /*
         * 5. Find or create the guest
         *
         * Email is the unique identifier.
         */
        const email = dto.guestEmail.trim().toLowerCase();

        const guest = await tx.guest.upsert({
          where: {
            email,
          },

          update: {
            firstName: dto.guestName.trim().split(' ')[0],
            lastName: dto.guestName.trim().split(' ')[1],
          },

          create: {
            firstName: dto.guestName.trim().split(' ')[0],
            lastName: dto.guestName.trim().split(' ')[1],
            email,
          },
        });

        /*
         * 6. Calculate number of nights
         */
        const millisecondsPerDay = 1000 * 60 * 60 * 24;

        const nights = Math.ceil(
          (checkOut.getTime() - checkIn.getTime()) / millisecondsPerDay,
        );

        /*
         * 7. Calculate base rate
         */
        const nightlyRate = new Prisma.Decimal(rate.price);

        /*
         * Guests included in the base occupancy
         */
        const extraGuests = Math.max(
          0,
          dto.totalGuests - roomType.baseOccupancy,
        );

        /*
         * Currently the extra guest count is
         * calculated but not charged.
         *
         * Add extra guest pricing here when
         * your RoomRate model supports it.
         */

        const subtotal = nightlyRate.mul(nights);

        const totalAmount = subtotal;

        /*
         * 8. Create reservation
         */
        const reservation = await tx.reservation.create({
          data: {
            guestId: guest.id,

            type: ReservationType.ONLINE,

            roomId: room.id,

            roomRateId: rate.id,

            checkIn,

            checkOut,

            // totalGuests: dto.totalGuests,

            nightlyRate,

            totalAmount,

            status: ReservationStatus.PENDING,

            note: dto.note,

            folio: {
              create: {},
            },
          },

          include: {
            guest: true,

            room: {
              include: {
                roomType: true,
              },
            },

            roomRate: true,
          },
        });

        /*
         * 9. Mark the physical room as reserved
         */
        await tx.room.update({
          where: {
            id: room.id,
          },

          data: {
            status: 'RESERVED',
          },
        });

        return {
          reservation,
          pricing: {
            nights,
            nightlyRate,
            subtotal,
            totalAmount,
            extraGuests,
          },
        };
      },

      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
  }

  async getRoomTypes() {
    const roomTypes = await this.prismaService.roomType.findMany({
      include: {
        rates: true,
      },
    });

    return roomTypes.map((roomType) => ({
      id: roomType.id,

      name: roomType.name,

      detail: `${roomType.maxGuests} guests · ${roomType.size} m²`,

      price: roomType.rates[0]?.price,

      image:
        roomType.name == 'Standard'
          ? 'https://res.cloudinary.com/dm49zhija/image/upload/v1786953554/standardroom_k2lkvj.jpg'
          : 'https://res.cloudinary.com/dm49zhija/image/upload/v1786953553/deluxeroom_tu8spx.jpg',
    }));
  }
}
