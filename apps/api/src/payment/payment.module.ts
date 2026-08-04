import { Module } from '@nestjs/common';
import { PaymentProvider } from './payment.interface';
import { PaystackService } from './providers/paystack.provider';
import { PaymentQueue } from './payment.queue';
import { PaymentWorker } from './payment.worker';
import { BullModule } from '@nestjs/bullmq';
import { PAYMENT_QUEUE } from './payment.constants';

@Module({
  imports: [
    BullModule.registerQueue({
      name: PAYMENT_QUEUE,
    }),
  ],
  controllers: [],
  providers: [
    { provide: PaymentProvider, useClass: PaystackService },
    PaymentQueue,
    PaymentWorker,
  ],
  exports: [PaymentProvider, PaymentQueue],
})
export class PaymentModule {}
