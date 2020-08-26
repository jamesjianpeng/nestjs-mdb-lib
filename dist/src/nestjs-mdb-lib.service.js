"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestjsMdbLibService = void 0;
const common_1 = require("@nestjs/common");
const mongodb_1 = require("mongodb");
const constants_1 = require("./constants");
const lodash_1 = __importDefault(require("lodash"));
let NestjsMdbLibService = class NestjsMdbLibService {
    constructor(options) {
        this.options = options;
        this.dbMap = {};
        this.cliMap = {};
        this.getClis();
    }
    onModuleInit() {
        return this.options;
    }
    async test() {
        return 'hello, nestjs mdb lib !';
    }
    async getClis() {
        const clis = this.options.map(async ({ url, key }) => {
            return { key, url, cli: await this.getCli(url) };
        });
        const res = await Promise.all(clis);
        const cliMap = {};
        res.map(({ key, url, cli }) => {
            cliMap[key] = cli;
        });
        this.cliMap = cliMap;
        return cliMap;
    }
    async getCliByKey(key) {
        let cli = this.cliMap[key];
        if (!cli) {
            const currentItem = lodash_1.default.find(this.options, ({ key: k }) => k === key);
            if (currentItem) {
                cli = await this.getCli(currentItem.url);
                this.cliMap[key] = cli;
            }
            else {
                console.error(`${key} is invaild key`);
            }
        }
        return cli;
    }
    async getCli(url) {
        return new Promise((resolve, reject) => {
            mongodb_1.MongoClient.connect(url, { useNewUrlParser: true, poolSize: 30, useUnifiedTopology: true }, (err, cli) => {
                if (err) {
                    return reject(err);
                }
                resolve(cli);
            });
        });
    }
    async getDb(cliKey, db) {
        let Db = this.dbMap[`${cliKey}_${db}`];
        if (!Db) {
            let cli = this.cliMap[cliKey];
            if (!cli) {
                const cliItem = lodash_1.default.find(this.options, ({ key }) => key === cliKey) || { url: '' };
                if (cliItem) {
                    cli = await this.getCli(cliItem.url);
                    this.cliMap[cliKey] = cli;
                }
                else {
                    console.error('regester option no has ' + cliKey);
                }
            }
            if (cli) {
                Db = cli.db(db);
                this.dbMap[`${cliKey}_${db}`] = Db;
            }
        }
        return Db;
    }
    async getCol(data) {
        const { db, col, cliKey } = data;
        let collection;
        let currentDb = this.dbMap[`${cliKey}_${db}`];
        if (!currentDb) {
            currentDb = await this.getDb(cliKey, db);
        }
        if (currentDb) {
            collection = await currentDb.collection(col);
        }
        return collection;
    }
};
NestjsMdbLibService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(constants_1.MDB_OPTIONS)),
    __metadata("design:paramtypes", [Array])
], NestjsMdbLibService);
exports.NestjsMdbLibService = NestjsMdbLibService;
