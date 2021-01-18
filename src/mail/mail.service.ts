import { Inject, Injectable } from '@nestjs/common';
import * as FormData from 'form-data';
import got from 'got/dist/source';
import { CONFIG_OPTIONS } from 'src/common/common.constant';
import { MailModuleOptions } from './mail.interfaces';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {
    console.log('### MailService > options: ', options);
    this.sendEmail('testing', 'test');
  }

  private async sendEmail(subject: string, content: string) {
    // mailgun api curl 설정
    const form = new FormData();
    form.append('from', `Excited User <mailgun@${this.options.domain}>`);
    form.append('to', `okwoyjy@gmail.com`);
    form.append('subject', subject);
    form.append('template', 'verify-email');
    form.append('v:code', 'confirmTestStringCodeee');
    form.append('v:username', 'YOON!!!');

    // mailgun으로 계속 req보내면 차단당한다는 얘기로 주석처리함.
    const response = await got(
      `https://api.mailgun.net/v3/${this.options.domain}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(
            `api:${this.options.apiKey}`,
          ).toString('base64')}`,
        },
        body: form,
      },
    );
    console.log('### MailService: ', response.body);
  }
}
