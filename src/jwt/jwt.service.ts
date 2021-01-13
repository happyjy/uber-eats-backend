import { DynamicModule, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { CONFIG_OPTIONS } from './jwt.constants';
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
    console.log(
      '### JwtService > sign > this.options.privateKey',
      this.options,
    );
    // configService에서 privateKey 값을 가지고 올 수 있다.
    console.log(
      '### JwtService > sign > this.options.privateKey',
      this.configService.get('PRIVATE_KEY'),
    );
    return jwt.sign({ id: userId }, this.options.privateKey);
  }
  verify(token: string) {
    console.log('### JwtService > veryfy > token: ', token);

    return jwt.verify(token, this.options.privateKey);
  }
}
