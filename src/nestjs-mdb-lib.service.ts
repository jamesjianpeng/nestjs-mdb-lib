import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import {
  MongoClient,
  MongoError,
  Db,
  Collection
} from 'mongodb'
import { MDB_OPTIONS } from './constants'
import {
  IMdbOptions,
  IMdb,
  IDbMap,
  ICli,
  ICliMap,
  IColOption
} from './interface'
import _ from 'lodash'

@Injectable()
export class NestjsMdbLibService implements OnModuleInit {

  private dbMap: IDbMap = {}
  private cliMap: ICliMap = {}

  constructor (
    @Inject(MDB_OPTIONS) private options: IMdbOptions
  ) {
    this.getClis()
  }

  onModuleInit () {
    return this.options
  }

  async test () {
    return 'hello, nestjs mdb lib !'
  }

  async getClis (): Promise<ICliMap> {
    const clis: Array<Promise<ICli>> = this.options.map(async ({ url, key }: IMdb): Promise<ICli> => {
      return  { key, url, cli: await this.getCli(url) }
    })
    const res: Array<ICli> = await Promise.all(clis)
    const cliMap: ICliMap  = {}
    res.map(({ key, url, cli }) => {
      cliMap[key] = cli
    })
    this.cliMap = cliMap
    return cliMap
  }

  /**
   * @description 通过 key 获取 mongo client
   * @param {string} key 这个可以 是与 options 中的 key 对应
   * @returns {Promise<MongoClient|undefined>} 返回对于的 MongoClient
   */
  async getCliByKey (key: string): Promise<MongoClient | undefined> {
    let cli = this.cliMap[key]
    if (!cli) {
      const currentItem: IMdb = _.find(this.options, ({ key: k }: IMdb) => k === key)
      if (currentItem) {
        cli = await this.getCli(currentItem.url)
        this.cliMap[key] = cli
      } else {
        console.error(`${key} is invaild key`)
      }
    }
    return cli
  }

  /**
   * @description 通过 url 的方式获取 MongoClient
   * @param  {string} url mongodb://<user>:<password>@<ip>:<port>
   * @returns {Promise<MongoClient>} 获取对应的 MongoClient
   */
  async getCli (url): Promise<MongoClient> {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, { useNewUrlParser: true, poolSize: 30, useUnifiedTopology: true }, (err: MongoError, cli: MongoClient) => {
          if (err) {
              return reject(err)
          }
          resolve(cli)
      })
    })
  }

  /**
   * @description 根据 options 对应的 key 和 db name 获取对应的 db
   * @param {string} cliKey  options 对应的 key
   * @param {string} db db name
   * @returns {Promise<Db|undefined>}
   */
  async getDb (cliKey: string, db: string): Promise<Db|undefined> {
    let Db: Db | undefined = this.dbMap[`${cliKey}_${db}`]
    if (!Db) {
      let cli: MongoClient | undefined = this.cliMap[cliKey]
      if (!cli) {
        const cliItem: MongoClient | undefined = _.find(this.options, ({ key }) => key === cliKey) || { url: '' } // this.options.find(({ key }) => key === cliKey) || { url: '' }
        if (cliItem) {
          cli = await this.getCli(cliItem.url)
          this.cliMap[cliKey] = cli
        } else {
          console.error('regester option no has ' + cliKey )
        }
      }
      if (cli) {
        Db = cli.db(db)
        this.dbMap[`${cliKey}_${db}`] = Db
      }
    }
    return Db
  }

  /**
   * @description 获取某个 collection
   * @param {IColOption} data
   * @returns {Promise<Collection|undefined>}
   */
  async getCol (data: IColOption): Promise<Collection|undefined> {
    const {db, col, cliKey } = data
    let collection: Collection | undefined
    let currentDb: MongoClient | undefined = this.dbMap[`${cliKey}_${db}`]
    if (!currentDb) {
      currentDb = await this.getDb(cliKey, db)
    }
    if (currentDb) {

      collection = await currentDb.collection(col)
    }
    return collection

  }
}
