import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { Prisma, PrismaClient } from '@prisma/client/extension';
import * as crypto from 'crypto';
import { RoleName } from '../../generated/prisma';

type PrismaExecutor = PrismaClient | Prisma.TransactionClient;

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(dto: CreateUserDto) {
    const userExists = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { phone: dto.phone }],
      },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (userExists)
      throw new ConflictException('Email or phone already exists');

    const hashedPassword = await argon2.hash(
      dto.password ?? process.env.SUPER_ADMIN_PASSWORD!,
    );

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          fullname: dto.fullname,
          email: dto.email,
          phone: dto.phone,
          password: hashedPassword,
          profileImage: dto.profileImage,
        },
      });

      const roleIds = dto.roleIds?.length
        ? dto.roleIds
        : [await this.getDefaultRoleId(tx)];

      await tx.userRole.createMany({
        data: roleIds.map((roleId) => ({
          userId: user.id,
          roleId,
        })),
      });

      return tx.user.findUnique({
        where: { id: user.id },
        include: {
          userRoles: {
            include: {
              role: {
                include: {
                  rolePermissions: {
                    include: {
                      permission: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    });
  }

  private async getDefaultRoleId(tx: Prisma.TransactionClient) {
    const role = await tx.role.findUnique({
      where: {
        name: 'FRONT_DESK_AGENT',
      },
    });

    if (!role) throw new InternalServerErrorException('Default role not found');

    return role.id;
  }

  async getUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    });
  }

  async getUsers(query: GetUsersDto) {
    const { page = 1, limit = 1000, search } = query;

    const skip = (page - 1) * limit;

    let where: any = {
      deleted: false,
    };

    if (search) {
      where.OR = [
        { fullname: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where: {
          ...where,
          userRoles: {
            some: {
              role: {
                name: query.roleName,
              },
            },
          },
        },
        skip,
        take: +limit,
        orderBy: { createdAt: 'desc' },

        select: {
          userRoles: {
            select: {
              role: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          id: true,
          fullname: true,
          email: true,
          phone: true,
          status: true,
          lastLogin: true,
          createdAt: true,
          profileImage: true,
        },
      }),

      this.prisma.user.count({ where }),
    ]);

    const usersData = users.map((user) => {
      const { userRoles, ...others } = user;

      return {
        ...others,
        roles: userRoles.map((userRole) => ({
          id: userRole.role.id,
          name: userRole.role.name,
        })),
      };
    });

    return {
      data: usersData,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async verifyEmail(
    email: string,
    otp: string,
    db: PrismaExecutor = this.prisma,
  ) {
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user || user.emailVerified) {
      throw new BadRequestException('Invalid verification attempt');
    }

    if (!user.emailOtpHash || !user.emailOtpExpiresAt) {
      throw new BadRequestException('No OTP found');
    }

    if (user.emailOtpExpiresAt < new Date()) {
      throw new BadRequestException('OTP expired');
    }

    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

    if (otpHash !== user.emailOtpHash) {
      throw new BadRequestException('Invalid OTP');
    }

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailOtpHash: null,
        emailOtpExpiresAt: null,
      },
    });

    const { password: _, ...safeUser } = updatedUser;

    return safeUser;
  }

  /**
   * ---------------------------------------------------------
   * GET USER ROLES
   * ---------------------------------------------------------
   *
   * GET /users/:id/roles
   */
  async getRoles(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userRoles = await this.prisma.userRole.findMany({
      where: {
        userId,
      },

      include: {
        role: true,
      },

      orderBy: {
        role: {
          name: 'asc',
        },
      },
    });

    return userRoles.map(({ role }) => ({
      id: role.id,
      name: role.name,
      isSystem: true,
    }));
  }

  /**
   * ---------------------------------------------------------
   * UPDATE USER ROLES
   * ---------------------------------------------------------
   *
   * PATCH /users/:id/roles
   *
   * Replaces the complete role set.
   */
  async updateRoles(userId: string, roleIds: string[]) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const uniqueRoleIds = [...new Set(roleIds)];

    /**
     * Resolve submitted roles.
     */
    const roles = await this.prisma.role.findMany({
      where: {
        id: {
          in: uniqueRoleIds,
        },
      },
    });

    /**
     * Check for invalid role IDs.
     */
    if (roles.length !== uniqueRoleIds.length) {
      const existingRoleIds = new Set(roles.map((role) => role.id));

      const invalidRoleIds = uniqueRoleIds.filter(
        (id) => !existingRoleIds.has(id),
      );

      throw new BadRequestException({
        message: 'Invalid roles',
        roleIds: invalidRoleIds,
      });
    }

    /**
     * IMPORTANT:
     *
     * Do not allow removing the SUPER_ADMIN role from
     * the only super admin account if your application
     * requires at least one super administrator.
     *
     * This check can be enabled below once you establish
     * your "minimum one super admin" policy.
     */

    await this.prisma.$transaction(async (tx) => {
      /**
       * Remove existing role assignments.
       */
      await tx.userRole.deleteMany({
        where: {
          userId,
        },
      });

      /**
       * Add the new role assignments.
       */
      if (uniqueRoleIds.length > 0) {
        await tx.userRole.createMany({
          data: uniqueRoleIds.map((roleId) => ({
            userId,
            roleId,
          })),

          skipDuplicates: true,
        });
      }
    });

    return this.getRoles(userId);
  }

  /**
   * ---------------------------------------------------------
   * ADD ONE ROLE
   * ---------------------------------------------------------
   *
   * Useful if you need a simple "Assign role" operation.
   */
  async addRole(userId: string, roleId: string) {
    const [user, role] = await Promise.all([
      this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      }),

      this.prisma.role.findUnique({
        where: {
          id: roleId,
        },
      }),
    ]);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    await this.prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId,
          roleId,
        },
      },

      update: {},

      create: {
        userId,
        roleId,
      },
    });

    return this.getRoles(userId);
  }

  /**
   * ---------------------------------------------------------
   * REMOVE ONE ROLE
   * ---------------------------------------------------------
   */
  async removeRole(userId: string, roleId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const role = await this.prisma.role.findUnique({
      where: {
        id: roleId,
      },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    /**
     * Prevent accidental removal of the last
     * SUPER_ADMIN.
     */
    if (role.name === RoleName.SUPER_ADMIN) {
      const superAdminCount = await this.prisma.userRole.count({
        where: {
          role: {
            name: RoleName.SUPER_ADMIN,
          },
        },
      });

      if (superAdminCount <= 1) {
        throw new BadRequestException(
          'Cannot remove the SUPER_ADMIN role from the last super administrator',
        );
      }
    }

    await this.prisma.userRole.delete({
      where: {
        userId_roleId: {
          userId,
          roleId,
        },
      },
    });

    return this.getRoles(userId);
  }

  softdelete(id: string) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        deleted: true,
      },
    });
  }

  delete(id: string) {
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
