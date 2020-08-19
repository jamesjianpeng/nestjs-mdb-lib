import { NestjsMdbLibService } from './nestjs-mdb-lib.service';
import { DynamicModule, Module, Global } from '@nestjs/common';
import { IMdbOptions } from './interface'
import { MDB_OPTIONS } from './constants'

@Module({
  providers: [NestjsMdbLibService],
  exports: [NestjsMdbLibService],
})
export class NestjsMdbLibModule {
  static register(options: IMdbOptions): DynamicModule {
    return {
      module: NestjsMdbLibModule,
      providers: [
        {
          provide: MDB_OPTIONS,
          useValue: options,
        },
        NestjsMdbLibService
      ],
      exports: [NestjsMdbLibService],
    };
  }
}
