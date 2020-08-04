import { Module } from '@nestjs/common';
import { NestjsMdbLibService } from './nestjs-mdb-lib.service';

@Module({
  providers: [NestjsMdbLibService],
  exports: [NestjsMdbLibService],
})
export class NestjsMdbLibModule {}
