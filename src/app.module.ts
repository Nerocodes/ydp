import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VideosModule } from './videos/videos.module';
import { VideosService } from './videos/videos.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    VideosModule,
  ],
  controllers: [AppController],
  providers: [AppService, VideosService],
})
export class AppModule {}
