import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserService } from 'src/users/users.service';
import { JwtService } from './jwt.service';

// export function JwtMiddleware(req: Request, res: Response, next: NextFunction) {
//   console.log('### JwtMiddleware > req.url: ', req.url);
//   console.log('### JwtMiddleware > req.headers: ', req.headers);
//   next();
// }

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  // # inject 가능하게 하기 위해 해야하는 설정 2가지
  // 1. inject 할 수 있는게 class에 @injectable() annotation !
  // 2. jwt, user module이 jwt, user Service를 exports 설정 !
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    console.log('### jwt.middleware > use > req.headers: ', req.headers);
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt'];
      console.log('### jwt.middleware > use > token: ', token);
      try {
        //sign 한것을 이곳에서 decoded
        const decoded = this.jwtService.verify(token.toString());
        console.log('### jwt.middleware > use > decoded: ', decoded);
        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          const { user, ok } = await this.userService.findById(decoded['id']);
          if (ok) {
            // # graphql context의 resolver에서 공유 가능
            req['user'] = user;
            req['test'] = 'requestSetting';
            console.log('### jwt.middleware > use: ', user);
          }
        }
      } catch (e) {}
    }
    // # next()수행하지 않으면 아래와 같은 에러 남.
    //  GraphQL playground에 Server cannot be reached, Faild to fetch schema. Please check your connection
    next(); // resolver 이전 middelWare에서 작업 처리후 resolver로 도달하게 해주는 function
  }
}
