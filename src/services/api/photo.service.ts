import { AxiosInstance } from 'axios';
import axios from '../axios';

export interface IPhoto {
  id?: number; // Optional: if you have an auto-incrementing primary key
  url?: string;
  description?: string; // Optional since it's not required
  userId?: number;
  createdAt?: Date; // Optional if auto-generated
}

export class PhotoService {
  private axiosInstance: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance;
  }

  async getPhotos() {
    return await this.axiosInstance.get('/photo/comments');
  }

  async uploadPhoto(photo: IPhoto) {
    return await this.axiosInstance.post('/photo', photo);
  }

  async deletePhoto(photoId: number, userId: number) {
    return await this.axiosInstance.delete(`/photo/${photoId}/${userId}`);
  }

  async updatePhoto(photo: IPhoto, userId: number) {
    return await this.axiosInstance.put(`/photo/${photo.id}/${userId}`, photo);
  }
}

export const photoService = new PhotoService(axios);
