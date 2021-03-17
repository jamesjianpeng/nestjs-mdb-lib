# nestjs-mdb-lib
nestjs mongodb 封装库
主要解决在一个 nestjs 项目中需要连接多个 mongodb 数据库

## 使用
- [example](https://github.com/jamesjianpeng/nestjs-mdb-lib/tree/master/example/test)

- curd.moudle.ts

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import settings from '../settings.json'
import { NestjsMdbLibModule } from '@smartblog/nestjs-mdb-lib'

@Module({
  imports: [
    NestjsMdbLibModule.register([
      { url: settings.mongo_sz, key: 'sz' },
      { url: settings.mongo_hk, key: 'hk' }
    ])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

- curd.service.ts

```typescript
import { Injectable } from '@nestjs/common';
import { NestjsMdbLibService } from '@smartblog/nestjs-mdb-lib'
@Injectable()
export class AppService {
  constructor (
    private nestjsMdbLibService: NestjsMdbLibService
  ) {}

  async test () {
    const data = { cliKey: 'sz', db:'ghost-live&learn', col: 'subject_sz' }
    const col = await this.nestjsMdbLibService.getCol(data)
    await col.insertOne({ subject: '数据库概率', code: '02323' })

    const dd = { cliKey: 'hk', db:'ghost-live&learn', col: 'subject_hk' }
    const colHk = await this.nestjsMdbLibService.getCol(dd)
    return Promise.resolve({ hk: await (await colHk.find()).toArray(), sz: await (await col.find()).toArray()})
  }

  async testMdb() {
    return await this.test()
  }
}
```

## API
### getClis

> 获取所有的 client

### getCli

> 获取某个 client

## getDb

> 获取 某个数据库
