import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import axios from 'axios';

@Controller('videos')
export class VideosController {
  private readonly apiKey = 'AIzaSyA0wcSfwoLK-V70qEYokGkodMCc0UFrpac';
  private readonly baseUrl = 'https://www.googleapis.com/youtube/v3';

  @Get('/:id')
  async getVideo(@Param('id') id: string) {
    try {
      const url = `${this.baseUrl}/videos?part=snippet,contentDetails,statistics&id=${id}&key=${this.apiKey}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch video details ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/:id/comments')
  async getComments(
    @Param('id') id: string,
    @Query('pageToken') pageToken: string,
  ) {
    let comments = [];

    try {
      const url = `${this.baseUrl}/commentThreads?part=snippet&videoId=${id}&key=${this.apiKey}&pageToken=${pageToken}`;
      const response = await axios.get(url);
      comments = [...comments, ...response.data.items];
      pageToken = response.data.nextPageToken || '';

      return {
        comments: comments.map(
          (comment) => comment.snippet.topLevelComment.snippet,
        ),
        nextPageToken: pageToken,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to fetch comments' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
