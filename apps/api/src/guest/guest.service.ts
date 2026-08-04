import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, PrismaClient } from '@prisma/client/extension';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { GetGuestsDto } from './dto/get-guests.dto';

type PrismaExecutor = PrismaClient | Prisma.TransactionClient;

@Injectable()
export class GuestService {
  constructor(private prisma: PrismaService) {}

  async createGuest(dto: CreateGuestDto) {
    const guestExists = await this.prisma.guest.findFirst({
      where: {
        OR: [{ email: dto.email }, { phone: dto.phone }],
      },
    });

    if (guestExists)
      throw new ConflictException(
        'Guest with the same Email or phone already exists',
      );

    return this.prisma.guest.create({
      data: { ...dto },
    });
  }

  async updateGuest(id: string, dto: UpdateGuestDto) {
    return this.prisma.guest.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    });
  }

  async getGuests(query: GetGuestsDto) {
    const { page = 1, limit = 1000, search } = query;

    const skip = (page - 1) * limit;

    let where: any = {};

    if (search) {
      where.OR = [
        { fullname: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [guests, total] = await this.prisma.$transaction([
      this.prisma.guest.findMany({
        where: {
          ...where,
        },
        skip,
        take: +limit,
        orderBy: { createdAt: 'desc' },

        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          nationality: true,
          createdAt: true,
          gender: true,
          passportId: true,
          dateOfBirth: true,
        },
      }),

      this.prisma.guest.count({ where }),
    ]);

    return {
      data: guests,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  softdelete(id: string) {
    return this.prisma.guest.update({
      where: {
        id,
      },
      data: {
        // deleted: true,
      },
    });
  }

  delete(id: string) {
    return this.prisma.guest.delete({
      where: {
        id,
      },
    });
  }
}
