import { Injectable } from '@nestjs/common';
import { CreateRatePlanDto } from './dto/create-rateplan.dto';
import { UpdateRatePlanDto } from './dto/update-rateplan.dto';
import { PrismaService } from '../prisma/prisma.service';
import { GetRatePlansDto } from './dto/get-rateplans.dto';

@Injectable()
export class RateplanService {
  constructor(private prismaService: PrismaService) {}

  create(createRateplanDto: CreateRatePlanDto) {
    return this.prismaService.ratePlan.create({
      data: createRateplanDto,
    });
  }

  async findAll(query: GetRatePlansDto) {
    const { page = 1, limit = 1000, search } = query;

    const skip = (page - 1) * limit;

    let where: any = {};

    if (search) {
      where.OR = [{ name: { contains: search, mode: 'insensitive' } }];
    }

    const [rateplans, total] = await this.prismaService.$transaction([
      this.prismaService.ratePlan.findMany({
        where: {
          ...where,
        },
        skip,
        take: +limit,
        orderBy: {},

        select: {
          id: true,
          name: true,
          cancellationPolicy: true,
          includesBreakfast: true,
          refundable: true,
        },
      }),

      this.prismaService.ratePlan.count({ where }),
    ]);

    return {
      data: rateplans,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  findOne(id: string) {
    return this.prismaService.ratePlan.findFirst({ where: { id } });
  }

  update(id: string, updateRateplanDto: UpdateRatePlanDto) {
    return this.prismaService.ratePlan.update({
      where: { id },
      data: updateRateplanDto,
    });
  }

  remove(id: string) {
    return this.prismaService.ratePlan.delete({
      where: { id },
    });
  }
}
