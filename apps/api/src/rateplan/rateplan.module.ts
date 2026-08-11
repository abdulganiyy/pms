import { Module } from '@nestjs/common';
import { RateplanService } from './rateplan.service';
import { RateplanController } from './rateplan.controller';

@Module({
  controllers: [RateplanController],
  providers: [RateplanService],
})
export class RateplanModule {}
