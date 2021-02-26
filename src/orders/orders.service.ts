import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dish } from 'src/restaurants/entities/dish.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orders: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItems: Repository<OrderItem>,
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
    @InjectRepository(Dish)
    private readonly dishes: Repository<Dish>,
  ) {}

  async createOrder(
    customer: User,
    { restaurantId, items }: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    const restaurant = await this.restaurants.findOne(restaurantId);
    if (!restaurant) {
      return {
        ok: false,
        error: 'Restaurant not found',
      };
    }

    console.log('### restaurant: ', restaurant);
    console.log('### items: ', items);

    for (const item of items) {
      const dish = await this.dishes.findOne(item.dishId);
      if (!dish) {
        // abort this whole thing
        return {
          ok: false,
          error: 'Dish not found.',
        };
      }

      console.log(`### Dish price: ${dish.price}`);
      for (const itemOption of item.options) {
        const dishOption = dish.options.find(
          // dishOption: dish 테이블 option
          // itemOption: order 주문 input data
          (dishOption) => dishOption.name === itemOption.name,
        );

        if (dishOption) {
          if (dishOption.extra) {
            console.log(`### $USD + ${dishOption.extra}`);
          } else {
            const dishOptionsChoice = dishOption.choices.find(
              (optionChoice) => optionChoice.name === itemOption.choice,
            );
            if (dishOptionsChoice) {
              if (dishOptionsChoice.extra) {
                console.log(`### $USD + ${dishOptionsChoice.extra}`);
              }
            }
          }
        }
      }
    }
    // const order = await this.orders.save(
    //   this.orders.create({
    //     customer,
    //     restaurant,
    //   }),
    // );
    // console.log(order);
  }
}
