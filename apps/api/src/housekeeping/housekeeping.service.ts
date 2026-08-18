import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HousekeepingStatus, RoomStatus } from '../../generated/prisma';
import { CreateHousekeepingTaskDto } from './dto/create-housekeeping-task.dto';
import { AssignHousekeepingTaskDto } from './dto/assign-housekeeping-task.dto';
import { GetHousekeepingTasksDto } from './dto/get-housekeeping-tasks.dto';

@Injectable()
export class HousekeepingService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateHousekeepingTaskDto) {
    const room = await this.prisma.room.findUnique({
      where: {
        id: dto.roomId,
      },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    if (
      room.status === RoomStatus.OUT_OF_ORDER ||
      room.status === RoomStatus.BLOCKED
    ) {
      throw new BadRequestException(
        `Room cannot be assigned for housekeeping while it is ${room.status}`,
      );
    }

    const task = await this.prisma.housekeepingTask.create({
      data: {
        roomId: dto.roomId,
        assignedToId: dto.assignedToId,
        notes: dto.notes,
      },
      include: {
        room: true,
        assignedTo: true,
      },
    });

    return task;
  }

  async findAll(query: GetHousekeepingTasksDto) {
    const { page = 1, limit = 1000, search } = query;

    const skip = (page - 1) * limit;

    let where: any = {};

    if (search) {
      where.OR = [];
    }

    const [housekeepingTasks, total] = await this.prisma.$transaction([
      this.prisma.housekeepingTask.findMany({
        where: {
          ...where,
        },
        skip,
        take: +limit,
        orderBy: { createdAt: 'desc' },

        include: {
          room: true,
          assignedTo: true,
        },
      }),

      this.prisma.housekeepingTask.count({ where }),
    ]);

    return {
      data: housekeepingTasks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const task = await this.prisma.housekeepingTask.findUnique({
      where: { id },
      include: {
        room: true,
        assignedTo: true,
      },
    });

    if (!task) {
      throw new NotFoundException('Housekeeping task not found');
    }

    return task;
  }

  async assign(id: string, dto: AssignHousekeepingTaskDto) {
    const task = await this.prisma.housekeepingTask.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException('Housekeeping task not found');
    }

    const staff = await this.prisma.user.findUnique({
      where: {
        id: dto.assignedToId,
      },
    });

    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    return this.prisma.housekeepingTask.update({
      where: { id },
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
    const task = await this.findOne(id);

    if (task.status !== HousekeepingStatus.PENDING) {
      throw new BadRequestException(
        'Only pending housekeeping tasks can be started',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedTask = await tx.housekeepingTask.update({
        where: { id },
        data: {
          status: HousekeepingStatus.IN_PROGRESS,
          startedAt: new Date(),
        },
        include: {
          room: true,
          assignedTo: true,
        },
      });

      await tx.room.update({
        where: {
          id: task.roomId,
        },
        data: {
          status: RoomStatus.CLEANING,
        },
      });

      return updatedTask;
    });
  }

  async complete(id: string) {
    const task = await this.findOne(id);

    if (task.status !== HousekeepingStatus.IN_PROGRESS) {
      throw new BadRequestException(
        'Only housekeeping tasks in progress can be completed',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedTask = await tx.housekeepingTask.update({
        where: { id },
        data: {
          status: HousekeepingStatus.COMPLETED,
          completedAt: new Date(),
        },
        include: {
          room: true,
          assignedTo: true,
        },
      });

      await tx.room.update({
        where: {
          id: task.roomId,
        },
        data: {
          status: RoomStatus.AVAILABLE,
        },
      });

      return updatedTask;
    });
  }

  async cancel(id: string) {
    const task = await this.findOne(id);

    if (task.status === HousekeepingStatus.COMPLETED) {
      throw new BadRequestException(
        'Completed housekeeping tasks cannot be cancelled',
      );
    }

    return this.prisma.housekeepingTask.delete({
      where: { id },
    });
  }
}
