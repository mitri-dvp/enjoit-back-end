import { IsString, IsNotEmpty, IsEmail, Length } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateCategoryDto {
  @IsString()
  name: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
