import { IsString, IsNotEmpty, IsEmail, Length, IsUrl } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateBrandDto {
  @IsString()
  readonly name: string;

  @IsString()
  @IsUrl()
  readonly image: string;
}

export class UpdateBrandDto extends PartialType(CreateBrandDto) {}
