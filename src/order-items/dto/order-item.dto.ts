import {
  IsString,
  IsNotEmpty,
  IsEmail,
  Length,
  IsUrl,
  IsNumber,
  IsPositive,
  IsArray,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateOrderItemDto {
  @IsNumber({ maxDecimalPlaces: 0 })
  @IsPositive()
  @IsNotEmpty()
  readonly quantity: number;

  @IsNumber({ maxDecimalPlaces: 0 })
  @IsPositive()
  @IsNotEmpty()
  readonly productId: number;

  @IsNumber({ maxDecimalPlaces: 0 })
  @IsPositive()
  @IsNotEmpty()
  readonly orderId: number;
}

export class UpdateOrderItemDto extends PartialType(CreateOrderItemDto) {}
