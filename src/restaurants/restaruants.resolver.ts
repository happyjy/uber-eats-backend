import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurants.service';

// decoration으로 이파일이 resolver 기능을 하도록 하는 기능을 한다.
@Resolver(() => Restaurant)
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}
  @Query((returns) => [Restaurant])
  restaurants(): Promise<Restaurant[]> {
    return this.restaurantService.getAll();
  }

  @Mutation((returns) => Boolean)
  createRestaurant(@Args() createRestaurantDto: CreateRestaurantDto): boolean {
    console.log(createRestaurantDto);
    return true;
  }

  // createRestaurant 변수로 들어가 @Args들을 Dto class를 만들어 보자 위 createRestaurant 확인
  // @Mutation((returns) => Boolean)
  // createRestaurant(
  //   @Args('name') name: string,
  //   @Args('isVegan') isVegan: boolean,
  // ): boolean {
  //   return true;
  // }

  // @Query((returns) => Boolean) // graphql을 위한 return type
  // isPizzaGood(): Boolean {
  //   // typscript를 위한 return type
  //   return true;
  // }
}
