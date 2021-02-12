import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from './dtos/update-restaurant.dto';
import { User } from 'src/users/entities/user.entity';
import { Category } from 'src/common/entities/category.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,
  ) {
    // console.log(
    //   '### RestaurantService > CreateRestaurantInput: ',
    //   CreateRestaurantInput,
    // );
    // console.log(
    //   '### RestaurantService > CreateRestaurantOutput: ',
    //   CreateRestaurantOutput,
    // );
  }
  getAll(): Promise<Restaurant[]> {
    return this.restaurants.find();
  }

  async createRestaurant(
    owner: User,
    createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    try {
      /*  
        # category가 없다면 생성
        # Repository.create: return Entity instance
      */
      const newRestaurant = this.restaurants.create(createRestaurantInput);
      newRestaurant.owner = owner;
      const categoryName = createRestaurantInput.categoryName
        .trim()
        .toLowerCase();
      const categorySlug = categoryName.replace(/ /g, '-');
      let category = await this.categories.findOne({ slug: categorySlug });
      if (!category) {
        category = await this.categories.save(
          this.categories.create({ slug: categorySlug, name: categoryName }),
        );
      }
      newRestaurant.category = category;
      await this.restaurants.save(newRestaurant);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not create restaurant',
      };
    }
  }

  // async createRestaurant(
  //   owner: User,
  //   createRestaurantInput: CreateRestaurantInput,
  // ): Promise<CreateRestaurantOutput> {
  //   try {
  //     /*
  //       # category가 없다면 생성
  //       # Repository.create: return Entity instance
  //     */
  //     const newRestaurant = this.restaurants.create(createRestaurantInput);
  //     newRestaurant.owner = owner;
  //     console.log(
  //       '### restaurant.service > createResaurant > newRestaurant: ',
  //       newRestaurant,
  //     );
  //     const categoryName = createRestaurantInput.categoryName
  //       .trim()
  //       .toLowerCase()
  //       .replace(/ +/g, ' ');
  //     console.log(
  //       '### restaurant.service > createResaurant > categoryName: ',
  //       categoryName,
  //     );
  //     const categorySlug = categoryName.replace(/ /g, '-');
  //     console.log(
  //       '### restaurant.service > createResaurant > categorySlug: ',
  //       categorySlug,
  //     );
  //     console.log(
  //       '### restaurant.service > createResaurant > this.categories.findOne: ',
  //       this.categories.findOne,
  //     );
  //     // let category = await this.categories.findOne({ slug: categorySlug });
  //     let category = await this.categories.findOne({ name: categoryName });
  //     console.log(
  //       '### restaurant.service > createResaurant > category: ',
  //       category,
  //     );
  //     if (!category) {
  //       console.log(
  //         '### restaurant.service > createResaurant > categorySlug, categoryName: ',
  //         categorySlug,
  //         categoryName,
  //       );
  //       const categoryEntity = this.categories.create({
  //         slug: categorySlug,
  //         name: categoryName,
  //       });
  //       console.log(
  //         '### restaurant.service > createResaurant > categoryEntity: ',
  //         categoryEntity,
  //       );
  //       category = await this.categories.save(categoryEntity);
  //     }
  //     console.log(
  //       '### restaurant.service > createResaurant > category: ',
  //       category,
  //     );
  //     newRestaurant.category = category;
  //     await this.restaurants.save(newRestaurant);
  //     return {
  //       ok: true,
  //     };
  //   } catch {
  //     return {
  //       ok: false,
  //       error: 'Could not create restaurant',
  //     };
  //   }
  // }
  updateRestaurant({ id, data }: UpdateRestaurantDto) {
    return this.restaurants.update(id, { ...data });
  }
}
