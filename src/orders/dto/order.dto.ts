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

export class CreateOrderDto {
  @IsNumber({ maxDecimalPlaces: 0 })
  @IsPositive()
  @IsNotEmpty()
  readonly customerId: number;
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
