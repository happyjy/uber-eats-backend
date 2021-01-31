import { Inject, Injectable } from '@nestjs/common';
import * as FormData from 'form-data';
import got from 'got';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { EmailVar, MailModuleOptions } from './mail.interfaces';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {
    console.log('### MailService > options: ', options);
    // this.sendEmail('testing', 'test');
  }

  async sendEmail(
    subject: string,
    template: string,
    emailVars: EmailVar[],
  ): Promise<boolean> {
    // mailgun api curl 설정
    const form = new FormData();

    form.append(
      'from',
      `Nico from Nuber Eats <mailgun@${this.options.domain}>`,
    );
    form.append('to', `okwoyjy@gmail.com`);
    form.append('subject', subject);
    form.append('template', template);

    console.log('### mailService: ', emailVars);
    emailVars.forEach((eVar) => form.append(`v:${eVar.key}`, eVar.value));
    try {
      await got.post(
        `https://api.mailgun.net/v3/${this.options.domain}/messages`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `api:${this.options.apiKey}`,
            ).toString('base64')}`,
          },
          body: form,
        },
      );
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  sendVerificationEmail(email: string, code: string) {
    this.sendEmail('Verify Your Email', 'verify-email', [
      { key: 'code', value: code },
      { key: 'username', value: email },
    ]);
  }
}
