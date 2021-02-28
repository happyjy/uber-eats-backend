import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from 'src/jwt/jwt.service';
import { User } from 'src/users/entities/user.entity';
import { UserService } from 'src/users/users.service';
import { AllowedRoles } from './role.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext) {
    /* 
      # metadata 유무 확인
      # metadata 있으면 -> user가 있다고 기대함
      # user 유무 확인 -> user role 구분.
    */
    // resolver에 설정한 Role decorator => eg) @Role(['Delivery'])
    const roles = this.reflector.get<AllowedRoles>(
      'roles',
      context.getHandler(), // 수행될 resolver
    );
    // console.log('### AuthGuard decorator > role: ', roles);
    // console.log(
    //   '### AuthGuard decorator > context.getHandler(): ',
    //   context.getHandler(),
    // );
    if (!roles) {
      return true;
    }

    // gqlContext == app.module.ts의 GraphQLModule의 context 설정
    const gqlContext = GqlExecutionContext.create(context).getContext();
    console.log(
      '### AuthGuard decorator > canActivate > gqlContext.token: ',
      gqlContext.token,
    );
    // console.log('### AuthGuard decorator > gqlContext: ', gqlContext);
    const token = gqlContext.token;
    if (token) {
      //sign 한것을 이곳에서 decoded
      const decoded = this.jwtService.verify(token.toString());
      console.log('### AuthGuard decorator > canActivate > decoded: ', decoded);
      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        const { user, ok } = await this.userService.findById(decoded['id']);
        console.log('### AuthGuard decorator > canActivate > user: ', user);
        if (user) {
          gqlContext['user'] = user;
          gqlContext['settingFromauthGuard'] = 'settingFromauthGuard';
          if (roles.includes('Any')) {
            console.log('### AuthGuard decorator > canActivate > user1: ');
            return true;
          }
          // console.log(
          //   '### AuthGuard decorator > canActivate > user2: ',
          //   roles,
          //   user.role,
          //   roles.includes(user.role),
          // );
          return roles.includes(user.role);
        }
      }
    }
    console.log('### AuthGuard decorator > canActivate > user3: ');
    return false;
  }
}
