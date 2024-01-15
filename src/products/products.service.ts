import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  In,
  Repository,
  FindOptionsWhere,
  Between,
  MoreThanOrEqual,
  LessThanOrEqual,
} from 'typeorm';

import {
  CreateProductDto,
  FindProductDto,
  UpdateProductDto,
} from './dto/product.dto';
import { Product } from './entities/product.entity';

import { BrandsService } from '../brands/brands.service';
import { Brand } from '../brands/entities/brand.entity';

import { CategoriesService } from '../categories/categories.service';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Brand) private brandRepository: Repository<Brand>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(payload: CreateProductDto): Promise<Product> {
    const newProduct = this.productRepository.create(payload);

    if (payload.brandId) {
      const brand = await this.brandRepository.findOne({
        where: { id: payload.brandId },
      });
      newProduct.brand = brand;
    }

    if (payload.categoriesIds) {
      const categories = await this.categoryRepository.findBy({
        id: In(payload.categoriesIds),
      });
      newProduct.categories = categories;
    }

    return await this.productRepository.save(newProduct);
  }

  async findAll(params?: FindProductDto): Promise<Product[]> {
    if (params) {
      const { limit, offset } = params;
      const { maxPrice, minPrice } = params;
      const where: FindOptionsWhere<Product> = {};

      const getPrice = () => {
        if (minPrice && maxPrice) return Between(minPrice, maxPrice);
        if (minPrice) return MoreThanOrEqual(minPrice);
        if (maxPrice) return LessThanOrEqual(maxPrice);
      };
      where.price = getPrice();

      return await this.productRepository.find({
        select: {
          brand: { id: true },
          categories: { id: true },
        },
        relations: { brand: true, categories: true },
        where: where,
        take: limit,
        skip: offset,
      });
    }
    return await this.productRepository.find({
      select: {
        brand: { id: true },
        categories: { id: true },
      },
      relations: { brand: true, categories: true },
    });
  }

  async findOne(id: number): Promise<Product> {
    return await this.productRepository.findOne({
      where: { id: id },
      relations: { brand: true, categories: true },
    });
  }

  async update(id: number, payload: UpdateProductDto) {
    const product = await this.findOne(id);

    if (payload.brandId) {
      const brand = await this.brandRepository.findOne({
        where: { id: payload.brandId },
      });
      product.brand = brand;
    }

    if (payload.categoriesIds) {
      const categories = await this.categoryRepository.findBy({
        id: In(payload.categoriesIds),
      });
      product.categories = categories;
    }

    this.productRepository.merge(product, payload);

    return this.productRepository.save(product);
  }

  async addCategoryToProduct(productId: number, categoryId: number) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: { categories: true },
    });

    if (!product) {
      throw new NotFoundException(`Product #${productId} not found`);
    }

    const inProductCategories = product.categories.find(
      (c) => c.id === categoryId,
    );

    if (inProductCategories) {
      throw new ConflictException(
        `Product #${productId} already includes Category #${categoryId}`,
      );
    }

    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Category #${categoryId} not found`);
    }

    product.categories.push(category);

    return await this.productRepository.save(product);
  }

  async removeCategoryFromProduct(productId: number, categoryId: number) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: { categories: true },
    });

    if (!product) {
      throw new NotFoundException(`Product #${productId} not found`);
    }

    product.categories = product.categories.filter((c) => c.id !== categoryId);

    return await this.productRepository.save(product);
  }

  async remove(id: number) {
    return await this.productRepository.delete(id);
  }
}
