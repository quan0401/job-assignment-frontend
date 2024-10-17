import { AxiosInstance } from 'axios';
import axios from '../axios';

export interface IComment {
  id?: number;
  text: string;
  createdAt?: Date;
  photoId?: number;
  userId?: number;
}

export class CommentService {
  private axiosInstance: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance;
  }
  async createComments(photoId: number, text: string, userId: number) {
    return await this.axiosInstance.post('/comment', {
      photoId,
      text,
      userId
    });
  }
}

export const commentService = new CommentService(axios);
