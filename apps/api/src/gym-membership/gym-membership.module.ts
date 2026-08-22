import { Module } from '@nestjs/common';

import { GymMembershipController } from './gym-membership.controller';
import { GymMembershipService } from './gym-membership.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [GymMembershipController],
  providers: [GymMembershipService, PrismaService],
  exports: [GymMembershipService],
})
export class GymMembershipModule {}
