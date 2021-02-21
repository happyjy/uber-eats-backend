import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { Category } from 'src/restaurants/entities/category.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { Dish } from './dish.entity';

/*
  # graphql type 생성 decorator
    - @ObjecType, @Field decorator

  # DB table 생성 decorator 
    - @Entity, @Column decorator
*/

// # graphQL의 Type은 하나만 사용할 수 있어 ObjectType과 같이 사용할 수 없다.
//  이때 isAbstract 옵션은 직접사용하지 않고 확장시켜 사용하는 의미로 설정해주면
//  ObjectType과 같이 사용할 수 있다.
// # @InputType 설정해야 dto에서 mappedType으로 사용될 수 있다.
//  하지만 OmitType constructor 3번째 args에 변경하고 싶은 Type으로 변경 가능하다.
// @InputType({ isAbstract: true })
@InputType('RestaurantInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {
  @Field(() => String)
  @Column()
  @IsString()
  @Length(5)
  name: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  coverImg: string;

  @Field((type) => String)
  @Column({ nullable: true })
  @IsString()
  address: string;

  @Field((type) => Category, { nullable: true })
  @ManyToOne((type) => Category, (category) => category.restaurants, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  category: Category;

  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user.restaurants, {
    onDelete: 'CASCADE',
  })
  owner: User;

  @RelationId((restaurant: Restaurant) => restaurant.owner)
  ownerId: number;

  @Field((type) => [Dish])
  @OneToMany((type) => Dish, (dish) => dish.restaurant)
  menu: Dish[];
}
