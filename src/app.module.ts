import { Module } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';

import { ConfigModule } from '@nestjs/config';
import { enviorments } from './config/enviorments';
import { validate } from './config/validation';
import config from './config/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CustomersModule } from './customers/customers.module';
import { CategoriesModule } from './categories/categories.module';
import { BrandsModule } from './brands/brands.module';
import { OrdersModule } from './orders/orders.module';
import { OrderItemsModule } from './order-items/order-items.module';

import { lastValueFrom } from 'rxjs';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    HttpModule,
    DatabaseModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    CustomersModule,
    CategoriesModule,
    BrandsModule,
    OrdersModule,
    OrderItemsModule,
    ProfileModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: enviorments[process.env.NODE_ENV] || '.env',
      load: [config],
      validate: validate,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'TASKS',
      useFactory: async (http: HttpService) => {
        // const tasksGET = await http.get(
        //   'https://jsonplaceholder.typicode.com/todos/',
        // );
        // const tasks = await lastValueFrom(tasksGET);
        // return tasks.data;
      },
      inject: [HttpService],
    },
  ],
})
export class AppModule {}
