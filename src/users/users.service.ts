import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { JwtService } from 'src/jwt/jwt.service';
import { UserProfileOutput } from './dtos/user-profile.dto';
import { VerifyEmailOutput } from './dtos/verify-email.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
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
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      const exists = await this.users.findOne({ email });
      if (exists) {
        return { ok: false, error: 'There is a user with that email already' };
      }
      // console.log('### users entity: ', this.users.create({ email, password, role }));
      const user = await this.users.save(
        this.users.create({ email, password, role }),
      );
      const verification = await this.verifications.save(
        this.verifications.create({
          user,
        }),
      );

      this.mailService.sendVerificationEmail(user.email, verification.code);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: "Couldn't create account" };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    // make a JWT and give it to the user
    try {
      // # user.entity.ts에 password column 설정으로
      //    select: false를 주면 findOne반환 값에 포함되지 않는다.
      const user = await this.users.findOne(
        { email },
        { select: ['id', 'password'] },
      );
      // user: user.entity.ts의 class 인스턴스
      console.log('### userService > login > user: ', user);

      if (!user) {
        return {
          ok: false,
          error: 'User not found',
        };
      }

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
      console.log('### userService > login > id, token: ', {
        id: user.id,
        token,
      });

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

  async findById(id: number): Promise<UserProfileOutput> {
    try {
      const user = await this.users.findOne({ id });
      if (user) {
        return {
          ok: true,
          user,
        };
      }
    } catch (error) {
      return { ok: false, error: 'User Not Found' };
    }
  }

  async editProfile(
    userId: number,
    { email, password }: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      const user = await this.users.findOne(userId);

      if (email) {
        user.email = email;
        user.verified = false;

        const verification = await this.verifications.save(
          this.verifications.create({ user }),
        );
        this.mailService.sendVerificationEmail(user.email, verification.code);
      }

      if (password) {
        user.password = password;
      }

      // upate: csascade하지 않고 해당 entity에만 저장한다/ entity여부를 확인하지 않는다.
      //      db에 query만 보내서 user entity의 beforeUpdate로 decorator한 hashPassword 함수가 수행되지 않는다.
      // save: 주어진 entity가 있으면 update, 없으면 save
      await this.users.save(user);

      return {
        ok: true,
      };
    } catch (error) {
      return { ok: false, error: 'Could not update profile.' };
    }
  }

  async verifyEmail(code: string): Promise<VerifyEmailOutput> {
    try {
      const verification = await this.verifications.findOne(
        { code },
        { relations: ['user'] }, // relation관계로 설정된 user 정보도 join해서 결과로 반환
      );

      if (verification) {
        console.log(
          '### userService: > verifyEmail > verification.user: ',
          verification.user,
        );

        verification.user.verified = true;
        this.users.save(verification.user);
        await this.verifications.delete(verification.id);
        return { ok: true };
      }
      return { ok: false, error: 'Verification not Found.' };
    } catch (error) {
      console.log(error);
      return { ok: false, error };
    }
  }
}
