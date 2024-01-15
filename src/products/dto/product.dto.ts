import {
  IsString,
  IsNotEmpty,
  IsEmail,
  Length,
  IsUrl,
  IsNumber,
  IsPositive,
  IsArray,
  IsOptional,
  Min,
  ValidateIf,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateProductDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsNumber({ maxDecimalPlaces: 0 })
  @IsPositive()
  readonly price: number;

  @IsNumber({ maxDecimalPlaces: 0 })
  @IsPositive()
  readonly stock: number;

  @IsString()
  @IsUrl()
  readonly image: string;

  @IsNumber({ maxDecimalPlaces: 0 })
  @IsPositive()
  @IsNotEmpty()
  readonly brandId: number;

  @IsArray()
  @IsNotEmpty()
  readonly categoriesIds: number[];
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class FindProductDto {
  @IsOptional()
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 0 })
  limit: number;

  @IsOptional()
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(0)
  offset: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(0)
  minPrice: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(0)
  maxPrice: number;
}
