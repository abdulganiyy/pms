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
import { MenuModule } from './menu/menu.module';
import { RestaurantorderModule } from './restaurantorder/restaurantorder.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { HousekeepingService } from './housekeeping/housekeeping.service';
import { MaintenanceService } from './maintenance/maintenance.service';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { HousekeepingModule } from './housekeeping/housekeeping.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { BookingModule } from './booking/booking.module';
import { LaundryModule } from './laundry/laundry.module';
import { GymMembershipModule } from './gym-membership/gym-membership.module';

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
    MenuModule,
    RestaurantorderModule,
    DashboardModule,
    RoleModule,
    PermissionModule,
    HousekeepingModule,
    MaintenanceModule,
    BookingModule,
    LaundryModule,
    GymMembershipModule,
  ],
  controllers: [AppController],
  providers: [AppService, HousekeepingService, MaintenanceService],
})
export class AppModule {}
