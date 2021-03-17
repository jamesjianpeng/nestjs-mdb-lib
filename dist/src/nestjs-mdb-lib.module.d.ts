import { DynamicModule } from '@nestjs/common';
import { IMdbOptions } from './interface';
export declare class NestjsMdbLibModule {
    static register(options: IMdbOptions): DynamicModule;
}
