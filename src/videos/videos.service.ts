import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VideosService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://www.googleapis.com/youtube/v3';
  private readonly logger = new Logger(VideosService.name);
  private readonly maxRetries = 5;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('YOUTUBE_API_KEY');
  }

  private async fetchWithRetries(url: string, retries = 0): Promise<any> {
    try {
      const response = await axios.get(url);
      return response;
    } catch (error) {
      if (
        error.response &&
        error.response.status === 429 &&
        retries < this.maxRetries
      ) {
        const delay = Math.pow(2, retries) * 1000; // Exponential backoff
        this.logger.warn(`Rate limit hit. Retrying in ${delay / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.fetchWithRetries(url, retries + 1);
      }

      this.logger.error(`Request failed: ${error.message}`, error.stack);
      throw new HttpException(
        'Failed to fetch data from YouTube API',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getVideo(id: string) {
    try {
      const url = `${this.baseUrl}/videos?part=snippet,contentDetails,statistics&id=${id}&key=${this.apiKey}`;
      const response = await this.fetchWithRetries(url);
      return response.data;
    } catch (error) {
      Logger.error(error.message, error.stack, 'VideosController.getVideo');
      throw new HttpException(
        'Failed to fetch video details ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getComments(id: string, pageToken: string) {
    let comments = [];

    try {
      const url = `${this.baseUrl}/commentThreads?part=snippet&videoId=${id}&key=${this.apiKey}&pageToken=${pageToken}&maxResults=10`;
      const response = await this.fetchWithRetries(url);
      comments = [...comments, ...response.data.items];
      pageToken = response.data.nextPageToken || '';

      return {
        comments: comments.map(
          (comment) => comment.snippet.topLevelComment.snippet,
        ),
        nextPageToken: pageToken,
      };
    } catch (error) {
      Logger.error(error.message, error.stack, 'VideosController.getComments');
      throw new HttpException(
        'Failed to fetch comments' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
