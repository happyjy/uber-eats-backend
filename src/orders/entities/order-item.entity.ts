import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Dish, DishOption } from 'src/restaurants/entities/dish.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@InputType('OrderItemOptionInputType', { isAbstract: true })
@ObjectType()
export class OrderItemOption {
  @Field((type) => String)
  name: string;
  @Field((type) => String, { nullable: true })
  choice: String;
}

@InputType('OrderItemInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class OrderItem extends CoreEntity {
  // 한개 메뉴(dish)에 옵션(options)를 선택하는 구조
  @Field((type) => Dish)
  @ManyToOne((type) => Dish, { nullable: true, onDelete: 'CASCADE' })
  dish: Dish;
  // dish.entity에서는 restaurant에서 OrderItem을 어떻게 가져 올지 신경써야 했지만
  // OrderItem에서는 그러지 않아도 됨.

  @Field((type) => [DishOption], { nullable: true })
  @Column({ type: 'json', nullable: true })
  options?: DishOption[];
}
