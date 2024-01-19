import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from '../orders/entities/order.entity';
import { Customer } from '../customers/entities/customer.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}
  async findMyOrders(userId: number) {
    const customer = await this.customerRepository.findOne({
      where: { user: { id: userId } },
    });
    return this.orderRepository.find({
      where: { customer: { id: customer.id } },
      relations: { items: { product: true } },
    });
  }
}
