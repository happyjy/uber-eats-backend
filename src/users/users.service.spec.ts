import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from './users.service';
import { JwtService } from 'src/jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';
import { User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';

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

// [] todo - 뭘까?: jest.fn(): mock function
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

// [] todo - 뭘까?
// type: ts 문법이겠지?
// <>: generic
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
  let service: UserService;
  let usersRepository: MockRepository<User>;
  let verificationsRepository: MockRepository<Verification>;
  let mailService: MailService;

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
    mailService = module.get<MailService>(MailService);

    // 가짜 db(db에 사용되는 entity 사용)
    usersRepository = module.get(getRepositoryToken(User));
    verificationsRepository = module.get(getRepositoryToken(Verification));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAccount', () => {
    const createAccountArgs = {
      email: 'bs@email.com',
      password: 'bs.pw',
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
      // #STEP1 - 계정 중복 검사
      const userFindOne = usersRepository.findOne.mockResolvedValue(undefined);
      // # 분석: usersRepository.create.mockReturnValue(createAccountArgs);
      //  - usersRepository.create의 return value 값은 아래 코드1의 "createAccountArgs" 값과 같아야 success!
      //  - 코드1: expect(usersRepository.save).toHaveBeenCalledWith(createAccountArgs)
      console.log(`#1: , ${userFindOne}/ ${userFindOne()}`); //userFindOne() promise 객체 반환
      userFindOne().then(
        (result) => console.log('promise > result: ', result),
        (error) => console.log('promise > result: ', error),
      );

      // usersRepository.create() 수행 시 createAccountArgs 반환
      usersRepository.create.mockReturnValue(createAccountArgs);
      usersRepository.save.mockResolvedValue(createAccountArgs);
      console.log('#1.1: ', usersRepository.create);

      verificationsRepository.create.mockReturnValue({
        user: createAccountArgs,
      });
      verificationsRepository.save.mockResolvedValue({
        code: 'code',
      });

      const result = await service.createAccount(createAccountArgs);

      console.log('#2: ', result);
      console.log('#3: ', Object.keys(usersRepository), usersRepository);
      // #STEP2 - 계정 생성
      expect(usersRepository.create).toHaveBeenCalledTimes(1);
      expect(usersRepository.create).toHaveBeenCalledWith(createAccountArgs);
      expect(usersRepository.save).toHaveBeenCalledTimes(1);
      expect(usersRepository.save).toHaveBeenCalledWith(createAccountArgs);

      // #STEP3 - 인증 단계
      expect(verificationsRepository.create).toHaveBeenCalledTimes(1);
      expect(verificationsRepository.create).toHaveBeenCalledWith({
        user: createAccountArgs,
      });
      expect(verificationsRepository.save).toHaveBeenCalledTimes(1);
      expect(verificationsRepository.save).toHaveBeenCalledWith({
        user: createAccountArgs,
      });

      // #STEP4 - 인증 메일 전송
      expect(mailService.sendVerificationEmail).toHaveBeenCalledTimes(1);
      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
      );
      expect(result).toEqual({ ok: true });
    });
  });

  it.todo('login');
  it.todo('findById');
  it.todo('editProfile');
  it.todo('verifyEmail');
});
