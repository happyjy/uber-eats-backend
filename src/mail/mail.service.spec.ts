import { Test } from '@nestjs/testing';
import { async } from 'rxjs';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { MailService } from './mail.service';

jest.mock('got', () => {});
jest.mock('form-data', () => {
  return {
    append: jest.fn(),
  };
});

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: CONFIG_OPTIONS,
          useValue: {
            apiKey: 'test-apiKey',
            domain: 'test-domain',
            fromEmail: 'test-fromEmail',
          },
        },
      ],
    }).compile();
    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendVerificationEmail', () => {
    it('should call sendEmail', () => {
      const sendVerificationEmailArgs = {
        email: 'email',
        code: 'code',
      };

      // * 함수를 mock할 수 없어 spy를 사용
      // * mockImplementation: sendEmail 함수를 모두 implementation 할 수 있음
      //    - sendVerificationEmail함수에서 sendEmail을 호출 했을 때 호출된 함수 sendEmail을 spyOn으로 구현하면 spyOn으로 구현된 함수가 수행된다.(실제 mailservice의 sendEmail을 호출하지 않는다. )
      jest.spyOn(service, 'sendEmail').mockImplementation(async () => {});
      service.sendVerificationEmail(
        sendVerificationEmailArgs.email,
        sendVerificationEmailArgs.code,
      );
      expect(service.sendEmail).toHaveBeenCalledTimes(1);
      expect(service.sendEmail).toHaveBeenCalledWith(
        'Verify Your Email',
        'verify-email',
        [
          { key: 'code', value: sendVerificationEmailArgs.code },
          { key: 'username', value: sendVerificationEmailArgs.email },
        ],
      );
    });
  });
  it.todo('sendEmail');
});
