import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import * as jwt from 'jsonwebtoken';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { JwtService } from './jwt.service';

// # POINT2.1: mock fn of module
//  - jsonwebtoken 모듈에 sign fn을 mock!
//  - jwt.service.spec.ts에 import 되어 있는 것이 대상
jest.mock('jsonwebtoken', () => {
  return {
    sign: jest.fn(() => 'TOKEN!!'),
  };
});

const TEST_KEY = 'testKey';

describe('JwtService', () => {
  let service: JwtService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      // # POINT1: Test.createTestingModule > providers 선언 방법
      //  : jwt.service에서 import 되는 모든 모듈을 provider에 설정해야한다.
      providers: [
        JwtService,
        ConfigService,
        {
          provide: CONFIG_OPTIONS,
          useValue: { privateKey: TEST_KEY },
        },
      ],
    }).compile();
    // # POINT0: service import 방법
    //  - <JwtService>: service type
    service = module.get<JwtService>(JwtService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('sign', () => {
    it('should return a signed token', () => {
      const ID = 1;
      // # POINT2
      //  : service.sign은 jwtService > sign 함수를 수행하는게 아니라
      // mock fn으로 설정 한(POINT2.1) fn을 수행
      const token = service.sign(ID);
      expect(typeof token).toBe('string');
      console.log('### token: ', token);
      expect(jwt.sign).toHaveBeenCalledTimes(1);
      expect(jwt.sign).toHaveBeenLastCalledWith({ id: ID }, TEST_KEY);
    });
  });
  describe('verify', () => {
    it('should return the decoded token', () => {});
  });
});
