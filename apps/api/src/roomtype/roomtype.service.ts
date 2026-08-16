import { Injectable } from '@nestjs/common';
import { CreateRoomTypeDto } from './dto/create-roomtype.dto';
import { UpdateRoomTypeDto } from './dto/update-roomtype.dto';
import { PrismaService } from '../prisma/prisma.service';
import { GetRoomTypesDto } from './dto/get-roomtypes.dto';

@Injectable()
export class RoomtypeService {
  constructor(private prismaService: PrismaService) {}

  create(createRoomTypeDto: CreateRoomTypeDto) {
    return this.prismaService.roomType.create({
      data: {
        ...createRoomTypeDto,
        maxGuests: createRoomTypeDto.maxAdults + createRoomTypeDto.maxChildren,
      },
    });
  }

  async findAll(query: GetRoomTypesDto) {
    const { page = 1, limit = 1000, search } = query;

    const skip = (page - 1) * limit;

    let where: any = {};

    if (search) {
      where.OR = [{ name: { contains: search, mode: 'insensitive' } }];
    }

    const [roomtypes, total] = await this.prismaService.$transaction([
      this.prismaService.roomType.findMany({
        where: {
          ...where,
        },
        skip,
        take: +limit,
        orderBy: { createdAt: 'desc' },

        select: {
          id: true,
          name: true,
          code: true,
          description: true,
          maxAdults: true,
          maxChildren: true,
          baseOccupancy: true,
          size: true,
        },
      }),

      this.prismaService.roomType.count({ where }),
    ]);

    return {
      data: roomtypes,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  findOne(id: string) {
    return this.prismaService.roomType.findFirst({
      where: { id },
    });
  }

  update(id: string, updateRoomtypeDto: UpdateRoomTypeDto) {
    return this.prismaService.roomType.update({
      where: { id },
      data: updateRoomtypeDto,
    });
  }

  remove(id: string) {
    return this.prismaService.roomType.delete({
      where: { id },
    });
  }
}
