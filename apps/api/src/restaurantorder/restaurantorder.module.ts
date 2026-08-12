import { Module } from '@nestjs/common';
import { RestaurantorderService } from './restaurantorder.service';
import { RestaurantorderController } from './restaurantorder.controller';

@Module({
  controllers: [RestaurantorderController],
  providers: [RestaurantorderService],
})
export class RestaurantorderModule {}
