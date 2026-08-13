import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RoomStatus } from '../../generated/prisma';

@Injectable()
export class RoomStatusService {
  constructor(private prismaService: PrismaService) {}

  async markOccupied(roomId: string) {
    return this.prismaService.room.update({
      where: { id: roomId },
      data: {
        status: RoomStatus.OCCUPIED,
      },
    });
  }

  async markDirty(roomId: string) {
    return this.prismaService.room.update({
      where: { id: roomId },
      data: {
        status: RoomStatus.DIRTY,
      },
    });
  }

  async markClean(roomId: string) {
    return this.prismaService.room.update({
      where: { id: roomId },
      data: {
        status: RoomStatus.AVAILABLE,
      },
    });
  }

  async markOutOfOrder(roomId: string) {
    return this.prismaService.room.update({
      where: { id: roomId },
      data: {
        status: RoomStatus.OUT_OF_ORDER,
      },
    });
  }
}
