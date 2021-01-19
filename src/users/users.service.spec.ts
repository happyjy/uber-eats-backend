import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import create from 'got/dist/source/create';
import { JwtService } from 'src/jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';
import { UserService } from './users.service';

// # issue!
//  - 내용: dictionary object로 설정하면 아래 라인데서 2번 호출된다고 함.
//      expect(usersRepository.create).toHaveBeenCalledTimes(1);
//  - 원인: mockRepository 반환값이 reference value인 객체로 설정했기 때문이다.
//  - 해결: mockRepository가 다른 reference를 갖을 수 있게 함수로 값을 반환하도록 수정했다.
//  - 부가 설명
//    - mockRepository가 함수로 객체를 return 했다.
//    - mockRepository를 설정하는 곳이 두 곳이 있다.
//    - 이 설정 될 때 reference 가 같은 object를 설정하면 두곳에서 같은 객체를 쓴다.
//    - 하지만! 함수로 객체를 반환하게 되면 반환된 두개의 객체는 다른 객체이다.

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

const mockMailService = {
  sendVerificationEmail: jest.fn(),
};

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
  let service: UserService;
  let usersRepository: MockRepository<User>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Verification),
          useValue: mockRepository(),
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();
    service = module.get<UserService>(UserService);
    usersRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAccount', () => {
    const createAccountArgs = {
      email: '',
      password: '',
      role: 0,
    };

    it('should fail if user exists', async () => {
      // mockResolvedValue: findOne이 해당 함수에 넘긴 인수를 return 한다고 속인다.
      usersRepository.findOne.mockResolvedValue({
        id: 1,
        email: '',
      });
      const result = await service.createAccount(createAccountArgs);
      expect(result).toMatchObject({
        ok: false,
        error: 'There is a user with that email already',
      });
    });

    it('should create a new use', async () => {
      usersRepository.findOne.mockResolvedValue(undefined);
      // # 분석: usersRepository.create.mockReturnValue(createAccountArgs);
      //  - usersRepository.create의 return value 값은 아래 코드1의 "createAccountArgs" 값과 같아야 success!
      //  - 코드1: expect(userRepository.save).toHaveBeenCalledWith(createAccountArgs)
      usersRepository.create.mockReturnValue(createAccountArgs);
      await service.createAccount(createAccountArgs);
      expect(usersRepository.create).toHaveBeenCalledTimes(1);
      expect(usersRepository.create).toHaveBeenCalledWith(createAccountArgs);
      expect(usersRepository.save).toHaveBeenCalledTimes(1);
      expect(usersRepository.save).toHaveBeenCalledWith(createAccountArgs);
    });
  });

  it.todo('login');
  it.todo('findById');
  it.todo('editProfile');
  it.todo('verifyEmail');
});
