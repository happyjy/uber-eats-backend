import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import * as Joi from 'joi'; // javascript module을 import 할때는 이런 식으로 한다.
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { RestaurantsModule } from './restaurants/restaurants.module';
// import { Restaurant } from './restaurants/entities/restaurant.entity';
import { JwtMiddleware } from './jwt/jwt.middleware';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
// import { CommonModule } from './common/common.module';
import { JwtModule } from './jwt/jwt.module';
// import { AuthModule } from './auth/auth.module';
@Module({
  // server 관련 설정
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        PRIVATE_KEY: Joi.string().required(),
      }),
    }),
    // DB 관련 설정
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: process.env.NODE_ENV !== 'prod',
      logging: process.env.NODE_ENV !== 'prod',
      entities: [User /* Restaurant */],
      // entities: ['src/entity/**/*.ts'],
      // migrations: ['src/migration/**/*.ts'],
      // subscribers: ['src/subscriber/**/*.ts'],
    }),
    // GrpahQL 관련 설정
    GraphQLModule.forRoot({
      autoSchemaFile: true, // 메모리에서 부터 스키마를 생성한다.
      context: ({ req }) => ({ user: req['user'] }),
      // autoSchemaFile: join(process.cwd(), 'src/schema.gql'), // schema file 생성
    }),
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
      test: 'abc',
    }),
    // RestaurantsModule,
    UsersModule,
    // AuthModule,
    // CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // client에서 forRoutes에 설정으로 request 보낼시 apply에 설정된 middleware execute
    consumer
      .apply(JwtMiddleware)
      .forRoutes({ path: '/graphql', method: RequestMethod.POST });
  }
}
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//      //consumer.apply(JwtMiddleware).exclude: 특정 요청 제외 적용시 사용
//     consumer.apply(JwtMiddleware).forRoutes({
//       // path: middleware 수행할 request 요청 받을 패턴
//       // method: middleware 수행할 req 요청 방식
//       path: '/graphql',  // *: 모든 route 적용
//       method: RequestMethod.POST, // RequestMethod.ALL: 모든 요청 방식
//     });
//   }
// }
