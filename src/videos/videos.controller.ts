import { Controller, Get, Param, Query } from '@nestjs/common';
import { VideosService } from './videos.service';

@Controller('videos')
export class VideosController {
  private readonly apiKey = 'AIzaSyA0wcSfwoLK-V70qEYokGkodMCc0UFrpac';
  private readonly baseUrl = 'https://www.googleapis.com/youtube/v3';

  constructor(private readonly videosService: VideosService) {}

  @Get('/:id')
  async getVideo(@Param('id') id: string) {
    const video = await this.videosService.getVideo(id);
    const commentsData = await this.videosService.getComments(id, '');

    return {
      video: video.items[0],
      comments: commentsData.comments,
      nextPageToken: commentsData.nextPageToken,
    };
  }

  @Get('/:id/comments')
  async getComments(
    @Param('id') id: string,
    @Query('pageToken') pageToken: string,
  ) {
    return this.videosService.getComments(id, pageToken);
  }
}
