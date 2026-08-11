import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './email/email.module';
import { PaymentModule } from './payment/payment.module';
import { SmsModule } from './sms/sms.module';
import { QueueModule } from './queue/queue.module';
import { GuestModule } from './guest/guest.module';
import { RoomtypeModule } from './roomtype/roomtype.module';
import { RateplanModule } from './rateplan/rateplan.module';
import { RoomrateModule } from './roomrate/roomrate.module';
import { RoomModule } from './room/room.module';
import { ReservationModule } from './reservation/reservation.module';
import { FolioModule } from './folio/folio.module';
import { FoliotransactionModule } from './foliotransaction/foliotransaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CommonModule,
    UserModule,
    AuthModule,
    PrismaModule,
    EmailModule,
    PaymentModule,
    SmsModule,
    QueueModule,
    GuestModule,
    RoomtypeModule,
    RateplanModule,
    RoomrateModule,
    RoomModule,
    ReservationModule,
    FolioModule,
    FoliotransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
