import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  NotFoundException,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

import { ProductsService } from './products.service';
import {
  CreateProductDto,
  FindProductDto,
  UpdateProductDto,
} from './dto/product.dto';

@ApiTags('products')
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productsService.create(createProductDto);
  }

  @ApiOperation({ summary: 'Gets a list of products' })
  @Public()
  @Get()
  async findAll(@Query() params: FindProductDto) {
    return await this.productsService.findAll(params);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const product = await this.productsService.findOne(+id);

    if (!product) {
      throw new NotFoundException(`Product #${id} not found.`);
    }

    return product;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.productsService.remove(+id);
  }

  @Put(':productId/categories/:categoryId')
  async addCategoryToProduct(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.productsService.addCategoryToProduct(productId, categoryId);
  }

  @Delete(':productId/categories/:categoryId')
  async removeCategoryFromProduct(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.productsService.removeCategoryFromProduct(
      productId,
      categoryId,
    );
  }
}
