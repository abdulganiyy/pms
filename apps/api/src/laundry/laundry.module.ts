import { Module } from '@nestjs/common';

import { LaundryController } from './laundry.controller';
import { LaundryService } from './laundry.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [LaundryController],
  providers: [LaundryService, PrismaService],
  exports: [LaundryService],
})
export class LaundryModule {}
