import { Module } from '@nestjs/common';
import { FoliotransactionService } from './foliotransaction.service';
import { FoliotransactionController } from './foliotransaction.controller';

@Module({
  controllers: [FoliotransactionController],
  providers: [FoliotransactionService],
})
export class FoliotransactionModule {}
