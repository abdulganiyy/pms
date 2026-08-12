import { ConflictException, Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { PrismaService } from '../prisma/prisma.service';
import { GetMenusDto } from './dto/get-menus.dto';

@Injectable()
export class MenuService {
  constructor(private prismaService: PrismaService) {}

  async create(createMenuDto: CreateMenuDto) {
    const menuExists = await this.prismaService.menuItem.findFirst({
      where: {
        name: createMenuDto.name,
      },
    });

    if (menuExists)
      throw new ConflictException('Menu with the same name already exists');

    return this.prismaService.menuItem.create({
      data: { ...createMenuDto },
    });
  }

  async findAll(query: GetMenusDto) {
    const { page = 1, limit = 1000, search } = query;

    const skip = (page - 1) * limit;

    let where: any = {};

    if (search) {
      where.OR = [{ name: { contains: search, mode: 'insensitive' } }];
    }

    const [menus, total] = await this.prismaService.$transaction([
      this.prismaService.menuItem.findMany({
        where: {
          ...where,
        },
        skip,
        take: +limit,
        orderBy: { name: 'desc' },

        select: {
          id: true,
          name: true,
          description: true,
          price: true,
        },
      }),

      this.prismaService.menuItem.count({ where }),
    ]);

    return {
      data: menus,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  findOne(id: string) {
    return this.prismaService.menuItem.findFirst({
      where: {
        id,
      },
    });
  }

  update(id: string, updateMenuDto: UpdateMenuDto) {
    return this.prismaService.menuItem.update({
      where: {
        id,
      },
      data: {
        ...updateMenuDto,
      },
    });
  }

  remove(id: string) {
    return this.prismaService.menuItem.delete({
      where: {
        id,
      },
    });
  }
}
