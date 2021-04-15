import {
  Field,
  InputType,
  Int,
  ObjectType,
  PickType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Dish } from '../entities/dish.entity';
import { Restaurant } from '../entities/restaurant.entity';

export enum HiddenType {
  'FALSE' = 0,
  'TRUE' = 1,
  'ALL' = 2,
}

export enum OrderType {
  'ASC' = 'ASC',
  'DESC' = 'DESC',
}

registerEnumType(HiddenType, { name: 'HiddenType' });
registerEnumType(OrderType, { name: 'OrderType' });
@InputType()
export class MyRestaurantInput extends PickType(Restaurant, ['id']) {
  @Field((type) => HiddenType, { defaultValue: HiddenType.ALL })
  @IsEnum(HiddenType)
  hiddenType: HiddenType;

  @Field((type) => OrderType, { defaultValue: OrderType.ASC })
  @IsEnum(OrderType)
  orderType: OrderType;
}

@ObjectType()
export class MyRestaurantOutput extends CoreOutput {
  @Field((type) => Restaurant, { nullable: true })
  restaurant?: Restaurant;
}
