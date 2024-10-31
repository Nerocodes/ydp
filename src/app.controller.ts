import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { VideosService } from './videos/videos.service';

@Controller()
export class AppController {
  constructor(private readonly videosService: VideosService) {}

  @Get()
  @Render('index')
  root() {
    return { video: null, comments: [] };
  }

  @Post()
  @Render('index')
  async search(@Body('videoId') videoId: string) {
    const video = await this.videosService.getVideo(videoId);
    const commentsData = await this.videosService.getComments(videoId);

    return {
      video: video.items[0],
      comments: commentsData.comments.map(
        (comment) => comment.snippet.topLevelComment.snippet,
      ),
      nextPageToken: commentsData.nextPageToken,
    };
  }
}
