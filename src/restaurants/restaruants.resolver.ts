import { Query, Resolver } from '@nestjs/graphql';

// decoration으로 이파일이 resolver 기능을 하도록 하는 기능을 한다.
@Resolver()
export class RestaurantResolver {
  @Query((returns) => Boolean) // graphql을 위한 return type
  isPizzaGood(): Boolean {
    // typscript를 위한 return type
    return true;
  }
}
