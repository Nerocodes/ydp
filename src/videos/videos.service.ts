import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class VideosService {
  private readonly apiKey = 'AIzaSyA0wcSfwoLK-V70qEYokGkodMCc0UFrpac';
  private readonly baseUrl = 'https://www.googleapis.com/youtube/v3';

  async getVideo(id: string) {
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

  async getComments(id: string) {
    let comments = [];
    let pageToken = '';

    try {
      const url = `${this.baseUrl}/commentThreads?part=snippet&videoId=${id}&key=${this.apiKey}&pageToken=${pageToken}&maxResults=10`;
      const response = await axios.get(url);
      comments = [...comments, ...response.data.items];
      pageToken = response.data.nextPageToken || '';

      return {
        comments,
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
