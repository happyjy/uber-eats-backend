import { Module, Query } from '@nestjs/common';
import { RestaurantResolver } from './restaruants.resolver';

@Module({
  providers: [RestaurantResolver],
})
export class restaurantsModule {}
