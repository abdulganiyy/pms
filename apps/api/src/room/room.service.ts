import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from '../prisma/prisma.service';
import { GetRoomsDto } from './dto/get-rooms.dto';

@Injectable()
export class RoomService {
  constructor(private prismaService: PrismaService) {}

  create(createRoomDto: CreateRoomDto) {
    return this.prismaService.room.create({
      data: createRoomDto,
    });
  }

  async findAll(query: GetRoomsDto) {
    const { page = 1, limit = 1000, search } = query;

    const skip = (page - 1) * limit;

    let where: any = {};

    if (search) {
      where.OR = [{ number: { contains: search, mode: 'insensitive' } }];
    }

    const [rooms, total] = await this.prismaService.$transaction([
      this.prismaService.room.findMany({
        where: {
          ...where,
        },
        skip,
        take: +limit,
        orderBy: {},

        select: {
          id: true,
          number: true,
          floor: true,
          status: true,
          roomType: {
            select: {
              id: true,
              name: true,
            },
          },
          reservations: {
            include: {
              guest: true,
              roomRate: true,
              room: true,
              folio: true,
            },
          },
          maintenance: true,
        },
      }),

      this.prismaService.room.count({ where }),
    ]);

    return {
      data: rooms,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  findOne(id: string) {
    return this.prismaService.room.findFirst({ where: { id } });
  }

  update(id: string, updateRoomDto: UpdateRoomDto) {
    return this.prismaService.room.update({
      where: { id },
      data: updateRoomDto,
    });
  }

  remove(id: string) {
    return this.prismaService.room.delete({ where: { id } });
  }
}
