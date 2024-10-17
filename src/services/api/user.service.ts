import { AxiosInstance } from 'axios';
import axios from '../axios';

export interface IUser {
  id?: number; // Optional: if you have an auto-incrementing primary key
  username: string;
  createdAt?: Date; // Optional if auto-generated
}
export class UserService {
  private axiosInstance: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance;
  }
  async createUser(username: string) {
    return await this.axiosInstance.post('/user/signup', {
      username
    });
  }
}

export const userService = new UserService(axios);
