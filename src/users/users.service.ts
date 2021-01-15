import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { CreateAccountInput } from './dtos/create-account.dto';
import { LoginInput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { EditProfileInput } from './dtos/edit-profile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    // console.log('### UserService > this: ', this);
    // console.log('### UserService > this.config.get: ', this.config.get);
    console.log(
      '### UserService > SECRET_KEY: ',
      this.config.get('SECRET_KEY'),
    );
    console.log('### UserService > SECRET_KEY: ', process.env.SECRET_KEY);

    this.jwtService.hello();
  }

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<{ ok: boolean; error?: string }> {
    try {
      const exists = await this.users.findOne({ email });
      if (exists) {
        return { ok: false, error: 'There is a user with that email already' };
      }
      // console.log('### users entity: ', this.users.create({ email, password, role }));
      await this.users.save(this.users.create({ email, password, role }));
      return { ok: true };
    } catch (e) {
      return { ok: false, error: "Couldn't create account" };
    }
  }

  async login({
    email,
    password,
  }: LoginInput): Promise<{ ok: boolean; error?: string; token?: string }> {
    // make a JWT and give it to the user
    try {
      const user = await this.users.findOne({ email });
      if (!user) {
        return {
          ok: false,
          error: 'User not found',
        };
      }
      // user: user.entity.ts의 class 인스턴스
      console.log('### userService > login > user: ', user);
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: 'Wrong password',
        };
      }
      // const token = jwt.sign({ id: user.id }, this.config.get('SECRET_KEY'));
      // # token: userid를 통해서 jwt token으로 사용자 정보를 갖게 한다.
      // const token = jwt.sign(
      //   { id: user.id },
      //   'yeGLi26PYml2LpKKOCQmoh4glKBKmCFw',
      // );
      const token = this.jwtService.sign(user.id);

      console.log('### userService > login > token: ', token);
      return {
        ok: true,
        token,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async findById(id: number): Promise<User> {
    return this.users.findOne({ id });
  }

  async editProfile(userId: number, editProfileInput: EditProfileInput) {
    console.log('### :', editProfileInput);
    return this.users.update(userId, { ...editProfileInput });
  }
}
