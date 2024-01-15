import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateOrderItemDto, UpdateOrderItemDto } from './dto/order-item.dto';
import { OrderItem } from './entities/order-item.entity';

import { Order } from '../orders/entities/order.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async create(payload: CreateOrderItemDto) {
    const order = await this.orderRepository.findOne({
      where: { id: payload.orderId },
    });
    const product = await this.productRepository.findOne({
      where: { id: payload.productId },
    });

    const orderItem = this.orderItemRepository.create();

    orderItem.order = order;
    orderItem.product = product;
    orderItem.quantity = payload.quantity;

    return await this.orderItemRepository.save(orderItem);
  }

  async findAll() {
    return await this.orderItemRepository.find({
      select: {
        order: {
          id: true,
        },
        product: {
          id: true,
          name: true,
        },
      },
      relations: { order: true, product: true },
    });
  }

  async findOne(id: number) {
    return `This action returns a #${id} orderItem`;
  }

  async update(id: number, updateOrderItemDto: UpdateOrderItemDto) {
    return `This action updates a #${id} orderItem`;
  }

  async remove(id: number) {
    return `This action removes a #${id} orderItem`;
  }
}
