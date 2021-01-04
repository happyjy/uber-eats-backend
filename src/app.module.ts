import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { restaurantsModule } from './restaurants/restaurants.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true, // 메모리에서 부터 스키마를 생성한다.
      // autoSchemaFile: join(process.cwd(), 'src/schema.gql'), // schema file 생성
    }),
    restaurantsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
