import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { MaintenanceStatus, RoomStatus } from '../../generated/prisma';

import { PrismaService } from '../prisma/prisma.service';

import { CreateMaintenanceTicketDto } from './dto/create-maintenance-ticket.dto';
import { AssignMaintenanceTicketDto } from './dto/assign-maintenance-ticket.dto';
import { GetMaintenancesDto } from './dto/get-maintenaces.dto';

@Injectable()
export class MaintenanceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMaintenanceTicketDto) {
    if (dto.roomId) {
      const room = await this.prisma.room.findUnique({
        where: {
          id: dto.roomId,
        },
      });

      if (!room) {
        throw new NotFoundException('Room not found');
      }
    }

    return this.prisma.maintenance.create({
      data: {
        roomId: dto.roomId,
        title: dto.title,
        description: dto.description,
        priority: dto.priority,
      },
      include: {
        room: true,
        reportedBy: true,
        assignedTo: true,
      },
    });
  }

  async findAll(query: GetMaintenancesDto) {
    const { page = 1, limit = 1000, search } = query;

    const skip = (page - 1) * limit;

    let where: any = {};

    if (search) {
      where.OR = [{ title: { contains: search, mode: 'insensitive' } }];
    }

    const [maintenaces, total] = await this.prisma.$transaction([
      this.prisma.maintenance.findMany({
        where: {
          ...where,
        },
        skip,
        take: +limit,
        orderBy: { createdAt: 'desc' },

        include: {
          room: true,
          reportedBy: true,
          assignedTo: true,
        },
      }),

      this.prisma.maintenance.count({ where }),
    ]);

    return {
      data: maintenaces,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const ticket = await this.prisma.maintenance.findUnique({
      where: {
        id,
      },
      include: {
        room: true,
        reportedBy: true,
        assignedTo: true,
      },
    });

    if (!ticket) {
      throw new NotFoundException('Maintenance ticket not found');
    }

    return ticket;
  }

  async assign(id: string, dto: AssignMaintenanceTicketDto) {
    const ticket = await this.findOne(id);

    if (ticket.status === MaintenanceStatus.RESOLVED) {
      throw new BadRequestException(
        'Resolved maintenance tickets cannot be assigned',
      );
    }

    const staff = await this.prisma.user.findUnique({
      where: {
        id: dto.assignedToId,
      },
    });

    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    return this.prisma.maintenance.update({
      where: {
        id,
      },
      data: {
        assignedToId: dto.assignedToId,
      },
      include: {
        room: true,
        assignedTo: true,
      },
    });
  }

  async start(id: string) {
    const ticket = await this.findOne(id);

    if (ticket.status !== MaintenanceStatus.REPORTED) {
      throw new BadRequestException(
        'This maintenance ticket cannot be started',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedTicket = await tx.maintenance.update({
        where: {
          id,
        },
        data: {
          status: MaintenanceStatus.IN_PROGRESS,
        },
        include: {
          room: true,
          assignedTo: true,
        },
      });

      if (ticket.roomId) {
        await tx.room.update({
          where: {
            id: ticket.roomId,
          },
          data: {
            status: RoomStatus.OUT_OF_SERVICE,
          },
        });
      }

      return updatedTicket;
    });
  }

  async resolve(id: string) {
    const ticket = await this.findOne(id);

    if (ticket.status !== MaintenanceStatus.IN_PROGRESS) {
      throw new BadRequestException(
        'Only maintenance tickets in progress can be resolved',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedTicket = await tx.maintenance.update({
        where: {
          id,
        },
        data: {
          status: MaintenanceStatus.RESOLVED,
          resolvedAt: new Date(),
        },
        include: {
          room: true,
          assignedTo: true,
        },
      });

      if (ticket.roomId) {
        await tx.room.update({
          where: {
            id: ticket.roomId,
          },
          data: {
            status: RoomStatus.AVAILABLE,
          },
        });
      }

      return updatedTicket;
    });
  }

  async cancel(id: string) {
    const ticket = await this.findOne(id);

    if (ticket.status === MaintenanceStatus.RESOLVED) {
      throw new BadRequestException(
        'Resolved maintenance tickets cannot be cancelled',
      );
    }

    return this.prisma.maintenance.delete({
      where: {
        id,
      },
    });
  }
}
