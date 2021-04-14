import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Restaurant } from '../entities/restaurant.entity';

enum hiddenType {
  'false' = 0,
  'true' = 1,
  'all' = 3,
}
@InputType()
export class MyRestaurantInput extends PickType(Restaurant, ['id']) {
  @Field((type) => Int, { defaultValue: hiddenType.all })
  hiddenType: number;
}

@ObjectType()
export class MyRestaurantOutput extends CoreOutput {
  @Field((type) => Restaurant, { nullable: true })
  restaurant?: Restaurant;
}
