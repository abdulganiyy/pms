import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { eachDayOfInterval, endOfDay, startOfDay, subDays } from 'date-fns';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    const now = new Date();

    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const [
      totalRooms,
      occupiedRooms,
      arrivals,
      departures,
      dirtyRooms,
      maintenanceRooms,
      outOfOrderRooms,
      recentArrivals,
      recentDepartures,
      recentPayments,
      occupancyData,
      revenue,
    ] = await Promise.all([
      this.prisma.room.count(),

      this.prisma.room.count({
        where: {
          status: 'OCCUPIED',
        },
      }),

      this.prisma.reservation.count({
        where: {
          checkIn: {
            gte: startOfDay,
            lte: endOfDay,
          },
          status: {
            in: ['CONFIRMED', 'CHECKED_IN'],
          },
        },
      }),

      this.prisma.reservation.count({
        where: {
          checkOut: {
            gte: startOfDay,
            lte: endOfDay,
          },
          status: 'CHECKED_IN',
        },
      }),

      this.prisma.room.count({
        where: {
          status: 'DIRTY',
        },
      }),

      this.prisma.room.count({
        where: {
          status: 'OUT_OF_SERVICE',
        },
      }),

      this.prisma.room.count({
        where: {
          status: 'OUT_OF_ORDER',
        },
      }),
      this.prisma.reservation.findMany({
        where: {
          checkIn: {
            lte: now,
          },
          status: {
            in: ['CONFIRMED', 'CHECKED_IN'],
          },
        },
        orderBy: {
          checkIn: 'desc',
        },
        take: 10,
        include: {
          guest: true,
          room: {
            include: {
              roomType: true,
            },
          },
        },
      }),

      this.prisma.reservation.findMany({
        where: {
          checkOut: {
            lte: now,
          },
          status: {
            in: ['CHECKED_IN', 'CHECKED_OUT'],
          },
        },
        orderBy: {
          checkOut: 'desc',
        },
        take: 10,
        include: {
          guest: true,
          room: {
            include: {
              roomType: true,
            },
          },
        },
      }),
      this.prisma.payment.findMany({
        where: {
          status: 'COMPLETED',
        },
        orderBy: { createdAt: 'desc' },
        take: 10,

        select: {
          id: true,
          amount: true,
          method: true,
          status: true,
          createdAt: true,

          folio: {
            select: {
              id: true,

              reservation: {
                select: {
                  id: true,

                  guest: {
                    select: {
                      id: true,
                      firstName: true,
                      lastName: true,
                    },
                  },

                  room: {
                    select: {
                      id: true,
                      number: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),
      this.getOccupancy(),
      this.getRevenue(),
    ]);

    // console.log(totalRooms, occupiedRooms);

    const occupancy =
      totalRooms > 0
        ? Number(((occupiedRooms / totalRooms) * 100).toFixed(1))
        : 0;

    return {
      stats: {
        occupancy,
        arrivals,
        departures,
        occupiedRooms,
        totalRooms,
      },

      roomStatus: {
        available:
          totalRooms -
          occupiedRooms -
          dirtyRooms -
          maintenanceRooms -
          outOfOrderRooms,

        occupied: occupiedRooms,
        dirty: dirtyRooms,
        maintenance: maintenanceRooms,
        outOfOrder: outOfOrderRooms,
      },
      recentArrivals,
      recentDepartures,
      recentPayments,
      occupancy: occupancyData,
      revenue,
    };
  }

  async getOccupancy() {
    const today = startOfDay(new Date());

    const sevenDaysAgo = startOfDay(subDays(today, 6));

    const days = eachDayOfInterval({
      start: sevenDaysAgo,
      end: today,
    });

    const totalRooms = await this.prisma.room.count({
      where: {
        status: {
          notIn: ['OUT_OF_ORDER', 'OUT_OF_SERVICE'],
        },
      },
    });

    if (totalRooms === 0) {
      return days.map((date) => ({
        date: date.toISOString(),
        percentage: 0,
      }));
    }

    const reservations = await this.prisma.reservation.findMany({
      where: {
        status: {
          in: ['CONFIRMED', 'CHECKED_IN'],
        },

        checkIn: {
          lte: endOfDay(today),
        },

        checkOut: {
          gte: sevenDaysAgo,
        },
      },

      select: {
        roomId: true,
        checkIn: true,
        checkOut: true,
      },
    });

    return days.map((date) => {
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);

      const occupiedRoomIds = new Set(
        reservations
          .filter((reservation) => {
            return (
              reservation.checkIn <= dayEnd && reservation.checkOut >= dayStart
            );
          })
          .map((reservation) => reservation.roomId)
          .filter(Boolean),
      );

      const percentage = (occupiedRoomIds.size / totalRooms) * 100;

      return {
        date: date.toISOString(),
        percentage: Math.round(percentage),
      };
    });
  }

  async getRevenue() {
    const today = new Date();

    const start = startOfDay(today);
    const end = endOfDay(today);

    const charges = await this.prisma.folioTransaction.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },

      select: {
        amount: true,
        type: true,
      },
    });

    let room = 0;
    let restaurant = 0;
    let services = 0;

    for (const charge of charges) {
      const amount = Number(charge.amount);

      switch (charge.type) {
        case 'ROOM_CHARGE':
          room += amount;
          break;

        case 'RESTAURANT_CHARGE':
          restaurant += amount;
          break;

        default:
          services += amount;
          break;
      }
    }

    const total = room + restaurant + services;

    return {
      room,
      restaurant,
      services,
      total,
    };
  }
}
