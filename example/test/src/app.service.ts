import { Injectable, OnModuleInit } from '@nestjs/common';
import { NestjsMdbLibService } from '../dist'
import { Db } from 'mongodb'
@Injectable()
export class AppService implements OnModuleInit {
  constructor (
    private nestjsMdbLibService: NestjsMdbLibService
  ) {}

  onModuleInit () {
  }

  async test () {
    const data = { cliKey: 'sz', db:'ghost-live&learn', col: 'subject_sz' }

    const col = await this.nestjsMdbLibService.getCol(data)
    await col.insertOne({ subject: '数据库概率', code: '02323' })

    const dd = { cliKey: 'hk', db:'hk', col: 'subject_hk' }
    const colHk = await this.nestjsMdbLibService.getCol(dd)
    return Promise.resolve({ hk: await (await colHk.find()).toArray(), sz: await (await col.find()).toArray()})
  }

  async testDb () {
    const db: Db = await this.nestjsMdbLibService.getDb('hk', 'ghost-live&learn')
    const colHk = db.collection('subject_hk')
    return await (await colHk.find().toArray())
  }

  async testMdb() {
    return await this.test()
  }
}
