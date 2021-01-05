import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { RestaurantsModule } from './restaurants/restaurants.module';

@Module({
  imports: [
    RestaurantsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'jaeyoonyoon',
      password: '12345',
      database: 'uber-eats',
      synchronize: true,
      logging: true,
      entities: ['src/entity/**/*.ts'],
      migrations: ['src/migration/**/*.ts'],
      subscribers: ['src/subscriber/**/*.ts'],
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true, // 메모리에서 부터 스키마를 생성한다.
      // autoSchemaFile: join(process.cwd(), 'src/schema.gql'), // schema file 생성
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
