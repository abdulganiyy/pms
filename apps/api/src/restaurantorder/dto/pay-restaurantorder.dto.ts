import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export enum RestaurantPaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
}

export class PayRestaurantOrderDto {
  @IsEnum(RestaurantPaymentMethod)
  method!: RestaurantPaymentMethod;

  @IsNumber()
  @Min(0.01)
  amount!: number;

  @IsOptional()
  @IsString()
  reference?: string;
}
