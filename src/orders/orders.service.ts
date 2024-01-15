import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';
import { Order } from './entities/order.entity';

import { Customer } from '../customers/entities/customer.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async create(payload: CreateOrderDto): Promise<Order> {
    const newOrder = this.orderRepository.create();

    if (payload.customerId) {
      const customer = await this.customerRepository.findOne({
        where: { id: payload.customerId },
      });

      if (!customer)
        throw new NotFoundException(
          `Customer #${payload.customerId} not found`,
        );
      newOrder.customer = customer;
    }

    return await this.orderRepository.save(newOrder);
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find({
      select: {
        customer: { id: true },
      },
      relations: { customer: true, items: { product: true } },
    });
  }

  async findOne(id: number): Promise<Order> {
    return await this.orderRepository.findOne({
      where: { id: id },
      relations: {
        customer: true,
        items: {
          product: true,
        },
      },
    });
  }

  async update(id: number, payload: UpdateOrderDto) {
    const order = await this.findOne(id);

    if (payload.customerId) {
      const customer = await this.customerRepository.findOne({
        where: { id: payload.customerId },
      });
      order.customer = customer;
    }

    return this.orderRepository.save(order);
  }

  async remove(id: number) {
    return await this.orderRepository.delete(id);
  }
}
