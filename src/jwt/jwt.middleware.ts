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
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt'];
      //sign 한것을 이곳에서 decoded
      const decoded = this.jwtService.verify(token.toString());
      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        try {
          const user = await this.userService.findById(decoded['id']);
          console.log('### jwt middleware > use: ', user);
          req['user'] = user;
          req['test'] = 'requestSetting';
        } catch (e) {}
      }
    }
  }
}
