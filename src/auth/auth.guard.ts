import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    // gqlContext == app.module.ts의 GraphQLModule의 context 설정
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const user = gqlContext['user'];
    console.log('### AuthGuard decorator > user: ', user);
    if (!user) {
      return false;
    } else {
      return true;
    }
  }
}
