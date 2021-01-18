import { Test } from '@nestjs/testing';
import { UserService } from './users.service';

describe('UserService', () => {
  // #STEP2
  //  : UserService만 따로 테스트
  //    (graphQL resolver, graphQL을 같이 테스트 하지 않음)
  let service: UserService;

  beforeAll(async () => {
    // #STEP1
    const module = await Test.createTestingModule({
      providers: [UserService],
    }).compile();
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it.todo('createAccount');
  it.todo('login');
  it.todo('findById');
  it.todo('editProfile');
  it.todo('verifyEmail');
});
