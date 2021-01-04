import { Args, Query, Resolver } from '@nestjs/graphql';
import { Restaurant } from './entities/restaurant.entity';

// decoration으로 이파일이 resolver 기능을 하도록 하는 기능을 한다.
@Resolver(() => Restaurant)
export class RestaurantResolver {
  @Query((returns) => [Restaurant])
  restaurants(@Args('veganOnly') veganOnly: boolean): Restaurant[] {
    return [];
  }
  // @Query((returns) => Boolean) // graphql을 위한 return type
  // isPizzaGood(): Boolean {
  //   // typscript를 위한 return type
  //   return true;
  // }
}
