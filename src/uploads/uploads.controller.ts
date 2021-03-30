import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import * as AWS from 'aws-sdk';

const BUCKET_NAME = 'happyjyubereatsclone';
@Controller('uploads')
export class UploadsController {
  constructor(private readonly configService: ConfigService) {}

  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  // uploadFile(@UploadedFile() file: Express.Multer.File) {
  async uploadFile(@UploadedFile() file) {
    console.log(file);
    console.log(process.env.accessKeyId);
    console.log(process.env.secretAccessKey);

    AWS.config.update({
      credentials: {
        // accessKeyId: process.env.accessKeyId,
        // secretAccessKey: process.env.secretAccessKey,
        accessKeyId: this.configService.get('AWS_KEY'),
        secretAccessKey: this.configService.get('AWS_SECRET'),
      },
    });
    try {
      const objectName = `${Date.now() + file.originalname}`;
      const upload = await new AWS.S3()
        // .createBucket({
        //   Bucket: BUCKET_NAME,
        // })
        .putObject({
          Body: file.buffer,
          Bucket: BUCKET_NAME,
          Key: objectName,
          ACL: 'public-read',
        })
        .promise();

      console.log('### upload: ', upload);
      const url = `https://${BUCKET_NAME}.s3.amazonaws.com/${objectName}`;
      return { url };
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
