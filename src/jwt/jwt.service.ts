import { DynamicModule, Injectable } from '@nestjs/common';
import { JwtModule } from './jwt.module';

@Injectable()
export class JwtService {
  hello() {
    console.log('hello');
  }
}
