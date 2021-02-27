import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { AllowedRoles } from './role.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext) {
    /* 
      # metadata 유무 확인
      # metadata 있으면 -> user가 있다고 기대함
      # user 유무 확인 -> user role 구분.
    */
    // resolver에 설정한 Role decorator => eg) @Role(['Delivery'])
    const role = this.reflector.get<AllowedRoles>(
      'roles',
      context.getHandler(), // 수행될 resolver
    );
    console.log('### AuthGuard decorator > role: ', role);
    console.log(
      '### AuthGuard decorator > context.getHandler(): ',
      context.getHandler(),
    );
    if (!role) {
      return true;
    }

    // gqlContext == app.module.ts의 GraphQLModule의 context 설정
    const gqlContext = GqlExecutionContext.create(context).getContext();
    console.log(
      '### AuthGuard decorator > gqlContext.token: ',
      gqlContext.token,
    );
    // console.log('### AuthGuard decorator > gqlContext: ', gqlContext);
    const user: User = gqlContext['user'];
    console.log('### AuthGuard decorator > user: ', user);
    if (!user) {
      return false;
    }
    if (role.includes('Any')) {
      return true;
    }
    return role.includes(user.role);
  }
}
