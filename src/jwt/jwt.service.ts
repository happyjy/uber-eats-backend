import { DynamicModule, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { CONFIG_OPTIONS } from 'src/common/common.constant';
import { JwtModuleOptions } from './jwt.interfaces';

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions,
    private readonly configService: ConfigService,
  ) {}
  hello() {
    console.log('hello');
  }
  sign(userId: number): string {
    // # env에 있는 privatekey 넘겨 받는 방법 2가지
    //  1. app.module에 jwt.module.forRoot 설정으로 env에 있는 private_key를 받는다.
    //  2. ConfigService 객체(@nestjs/config모듈)의 get 함수로 private_key를 받는다.
    console.log('### JwtService > sign > this.options: ', this.options);
    console.log(
      '### JwtService > sign > this.configService.get(PRIVATE_KEY)',
      this.configService.get('PRIVATE_KEY'),
    );
    return jwt.sign({ id: userId }, this.options.privateKey);
  }
  verify(token: string) {
    console.log(
      '### JwtService > veryfy > privateKey: ',
      this.options.privateKey,
    );

    return jwt.verify(token, this.options.privateKey);
  }
}
