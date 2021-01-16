import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';
import { CreateAccountInput } from './dtos/create-account.dto';
import { LoginInput } from './dtos/login.dto';
import { EditProfileInput } from './dtos/edit-profile.dto';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
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
      const user = await this.users.save(
        this.users.create({ email, password, role }),
      );
      await this.verifications.save(
        this.verifications.create({
          user,
        }),
      );
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

  async editProfile(
    userId: number,
    { email, password }: EditProfileInput,
  ): Promise<User> {
    const user = await this.users.findOne(userId);

    if (email) {
      user.email = email;
      user.verified = false;
      await this.verifications.save(this.verifications.create({ user }));
    }
    if (password) {
      user.password = password;
    }
    // upate: csascade하지 않고 해당 entity에만 저장한다/ entity여부를 확인하지 않는다.
    //      db에 query만 보내서 user entity의 beforeUpdate로 decorator한 hashPassword 함수가 수행되지 않는다.
    // save: 주어진 entity가 있으면 update, 없으면 save
    return this.users.save(user);
  }

  async verifyEmail(code: string): Promise<boolean> {
    const verification = await this.verifications.findOne(
      { code },
      { relations: ['user'] },
    );
    if (verification) {
      console.log(
        '### userService: > verifyEmail > verification: ',
        verification,
      );

      verification.user.verified = true;
      this.users.save(verification.user);

      return false;
    }
  }
}
