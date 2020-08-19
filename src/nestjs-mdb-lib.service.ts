import { Injectable } from '@nestjs/common';

@Injectable()
export class NestjsMdbLibService {
  test () {
    return 'welcom use NestjsMdbLibModule, new version!'
  }
}
