import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import settings from '../settings.json'
import { NestjsMdbLibModule } from '../dist'

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
