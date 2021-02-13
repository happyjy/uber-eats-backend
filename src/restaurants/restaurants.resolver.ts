import {
  Args,
  Int,
  Mutation,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurants.service';
import { UpdateRestaurantDto } from './dtos/update-restaurant.dto';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import {
  EditRestaurantInput,
  EditRestaurantOutput,
} from './dtos/edit-restaurant.dto';
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from './dtos/delete-restaurant.dto';
import { Category } from './entities/category.entity';
import { AllCategoriesOutput } from './dtos/all-categories.dto';

// decoration으로 이파일이 resolver 기능을 하도록 하는 기능을 한다.
@Resolver(() => Restaurant)
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Mutation((returns) => CreateRestaurantOutput)
  @Role(['Owner'])
  async createRestaurant(
    @AuthUser() authUser: User,
    @Args('input') createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    return this.restaurantService.createRestaurant(
      authUser,
      createRestaurantInput,
    );
  }

  @Mutation((returns) => EditRestaurantOutput)
  @Role(['Owner'])
  editRestaurant(
    @AuthUser() owner: User,
    @Args('input') editRestaurantInput: EditRestaurantInput,
  ): Promise<EditRestaurantOutput> {
    return this.restaurantService.editRestaurant(owner, editRestaurantInput);
  }

  @Mutation((returns) => DeleteRestaurantOutput)
  @Role(['Owner'])
  deleteRestaurant(
    @AuthUser() owner: User,
    @Args('input') DeleteRestaurantInput: DeleteRestaurantInput,
  ) {
    return this.restaurantService.deleteRestaurant(
      owner,
      DeleteRestaurantInput,
    );
  }
  // @Query((returns) => [Restaurant])
  // restaurants(): Promise<Restaurant[]> {
  //   console.log(CreateRestaurantOutput);
  //   return this.restaurantService.getAll();
  // }

  // @Mutation((returns) => Boolean)
  // async updateRestaurant(
  //   // # 'input' 설명
  //   //  - dto에 @InputType을 사용했을때 사용하는 설정 방법이다.
  //   //  - InputType이 아니라 @ArgsType() 사용할 경우 @Args()로 설정하면된다.
  //   @Args('input') updateRestaurantDto: UpdateRestaurantDto,
  // ): Promise<boolean> {
  //   console.log('### updateRestaurant', updateRestaurantDto);
  //   try {
  //     await this.restaurantService.updateRestaurant(updateRestaurantDto);
  //     return true;
  //   } catch (e) {
  //     console.log(e);
  //     return false;
  //   }
  // }

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

@Resolver((of) => Category)
export class CategoryResolver {
  constructor(private readonly restaurantservice: RestaurantService) {}

  @ResolveField((type) => Int)
  restaurantCount(): number {
    return 80;
  }

  @Query((type) => AllCategoriesOutput)
  allCategories(): Promise<AllCategoriesOutput> {
    return this.restaurantservice.allCategories();
  }
}
