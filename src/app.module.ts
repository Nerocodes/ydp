import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VideosModule } from './videos/videos.module';
import { VideosService } from './videos/videos.service';

@Module({
  imports: [VideosModule, VideosModule],
  controllers: [AppController],
  providers: [AppService, VideosService],
})
export class AppModule {}
