import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateBrandDto, UpdateBrandDto } from './dto/brand.dto';
import { Brand } from './entities/brand.entity';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand) private brandRepository: Repository<Brand>,
  ) {}

  async create(createBrandDto: CreateBrandDto): Promise<Brand> {
    const newBrand = this.brandRepository.create(createBrandDto);
    return await this.brandRepository.save(newBrand);
  }

  async findAll(): Promise<Brand[]> {
    return await this.brandRepository.find();
  }

  async findOne(id: number): Promise<Brand> {
    const brand = await this.brandRepository.findOne({
      where: { id: id },
      relations: { products: true },
    });

    if (!brand) {
      throw new NotFoundException(`Brand #${id} not found`);
    }

    return brand;
  }

  async update(id: number, updateBrandDto: UpdateBrandDto): Promise<Brand> {
    const brand = await this.findOne(id);

    this.brandRepository.merge(brand, updateBrandDto);

    return await this.brandRepository.save(brand);
  }

  async remove(id: number) {
    return this.brandRepository.delete(id);
  }
}
