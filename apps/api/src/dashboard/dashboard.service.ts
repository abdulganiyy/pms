import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
    ] = await Promise.all([
      this.prisma.room.count({
        where: {
          //   isActive: true,
        },
      }),

      this.prisma.room.count({
        where: {
          //   isActive: true,
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
          //   status: 'MAINTENANCE',
        },
      }),

      this.prisma.room.count({
        where: {
          status: 'OUT_OF_ORDER',
        },
      }),
    ]);

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
    };
  }
}
