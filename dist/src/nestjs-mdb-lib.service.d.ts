import { OnModuleInit } from '@nestjs/common';
import { MongoClient, Db, Collection } from 'mongodb';
import { IMdbOptions, IColOption } from './interface';
export declare class NestjsMdbLibService implements OnModuleInit {
    private options;
    private dbMap;
    private cliMap;
    constructor(options: IMdbOptions);
    onModuleInit(): IMdbOptions;
    test(): Promise<string>;
    getClis(): Promise<void>;
    getCli(url: any): Promise<MongoClient>;
    getDb(cliKey: string, db: string): Promise<Db>;
    getCol(data: IColOption): Promise<Collection>;
}
