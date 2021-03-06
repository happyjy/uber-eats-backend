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
import { JwtMiddleware } from './jwt/jwt.middleware';
import { JwtModule } from './jwt/jwt.module';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
// import { RestaurantsModule } from './restaurants/restaurants.module';
// import { CommonModule } from './common/common.module';
import { Verification } from './users/entities/verification.entity';
import { User } from './users/entities/user.entity';
import { Restaurant } from './restaurants/entities/restaurant.entity';
import { Category } from './restaurants/entities/category.entity';
import { Dish } from './restaurants/entities/dish.entity';
import { Order } from './orders/entities/order.entity';
import { OrdersModule } from './orders/orders.module';
import { OrderItem } from './orders/entities/order-item.entity';
import { CommonModule } from './common/common.module';
import { PaymentsModule } from './payments/payments.module';
import { Payment } from './payments/entities/payment.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { UploadsModule } from './uploads/uploads.module';

console.log('### process.env.NODE_ENV: ', process.env.NODE_ENV);
@Module({
  // server 관련 설정
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'production', 'test').required(),
        DB_HOST: Joi.string(),
        DB_PORT: Joi.string(),
        DB_USERNAME: Joi.string(),
        DB_PASSWORD: Joi.string(),
        DB_NAME: Joi.string(),
        PRIVATE_KEY: Joi.string().required(),
        MAILGUN_API_KEY: Joi.string().required(),
        MAILGUN_DOMAIN_NAME: Joi.string().required(),
        MAILGUN_FROM_EMAIL: Joi.string().required(),
        AWS_KEY: Joi.string().required(),
        AWS_SECRET: Joi.string().required(),
      }),
    }),
    // DB 관련 설정
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...(process.env.DATABASE_URL
        ? { url: process.env.DATABASE_URL }
        : {
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
          }),
      synchronize: process.env.NODE_ENV !== 'prod',
      logging:
        process.env.NODE_ENV !== 'prod' && process.env.NODE_ENV !== 'test',
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : null,
      entities: [
        User,
        Verification,
        Restaurant,
        Category,
        Dish,
        Order,
        OrderItem,
        Payment,
      ], // table 생성 설정
      // entities: ['src/entity/**/*.ts'],
      // migrations: ['src/migration/**/*.ts'],
      // subscribers: ['src/subscriber/**/*.ts'],
    }),
    // GrpahQL 관련 설정
    // GraphQlModule 구현 코드 github: https://github.com/nestjs/graphql/blob/master/lib/graphql.module.ts
    GraphQLModule.forRoot({
      playground: process.env.NODE_ENV !== 'production',
      installSubscriptionHandlers: true,
      autoSchemaFile: true, // 메모리에서 부터 스키마를 생성한다.
      context: ({ req, connection }) => {
        // console.log(
        //   '### app.module.ts -> GraphQLModule.forRoot({context: fn}) > req.user, req.test: ',
        //   { test: req.test, user: req.user },
        // );
        const TOKEN_KEY = 'x-jwt';
        return {
          // query를 이용해 연결할 때는 req headers를 사용
          // subscription을 이용해 연결할 때는 connection context를 사용
          token: req ? req.headers['x-jwt'] : connection.context['X-JWT'],
        };
      },
      // autoSchemaFile: join(process.cwd(), 'src/schema.gql'), // schema file 생성
    }),
    ScheduleModule.forRoot(),
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
      test: 'abc',
    }),
    MailModule.forRoot({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN_NAME,
      fromEmail: process.env.MAILGUN_FROM_EMAIL,
    }),
    AuthModule,
    RestaurantsModule,
    UsersModule,
    OrdersModule,
    CommonModule,
    PaymentsModule,
    UploadsModule,
    // CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
// ### subscription 구현하면서 제거 됨
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     // client에서 forRoutes에 설정으로 request 보낼시 apply에 설정된 middleware execute
//     consumer
//       .apply(JwtMiddleware)
//       .forRoutes({ path: '/graphql', method: RequestMethod.POST });
//   }
// }

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
