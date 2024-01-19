import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';

import { Order } from '../orders/entities/order.entity';
import { Customer } from '../customers/entities/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Customer])],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
