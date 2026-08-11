import { Injectable } from '@nestjs/common';
import { CreateRoomRateDto } from './dto/create-roomrate.dto';
import { UpdateRoomRateDto } from './dto/update-roomrate.dto';
import { PrismaService } from '../prisma/prisma.service';
import { GetRoomRatesDto } from './dto/get-roomrates.dto';

@Injectable()
export class RoomrateService {
  constructor(private prismaService: PrismaService) {}

  create(createRoomrateDto: CreateRoomRateDto) {
    return this.prismaService.roomRate.create({
      data: createRoomrateDto,
    });
  }

  async findAll(query: GetRoomRatesDto) {
    const { page = 1, limit = 1000, search } = query;

    const skip = (page - 1) * limit;

    let where: any = {};

    if (search) {
      where.OR = [{ name: { contains: search, mode: 'insensitive' } }];
    }

    const [roomrates, total] = await this.prismaService.$transaction([
      this.prismaService.roomRate.findMany({
        where: {
          ...where,
        },
        skip,
        take: +limit,
        orderBy: {},

        select: {
          id: true,
          roomType: {
            select: {
              id: true,
              name: true,
            },
          },
          ratePlan: {
            select: {
              id: true,
              name: true,
            },
          },
          startDate: true,
          endDate: true,
          price: true,
          currency: true,
        },
      }),

      this.prismaService.roomRate.count({ where }),
    ]);

    return {
      data: roomrates,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  findOne(id: string) {
    return this.prismaService.roomRate.findFirst({ where: { id } });
  }

  update(id: string, updateRoomrateDto: UpdateRoomRateDto) {
    return this.prismaService.roomRate.update({
      where: { id },
      data: updateRoomrateDto,
    });
  }

  remove(id: string) {
    return this.prismaService.roomRate.delete({ where: { id } });
  }
}
