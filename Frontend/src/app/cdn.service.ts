import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class CdnService {
  private baseUrl = 'http://132.145.206.61:1001';

  async uploadFile(file: File, config?: any): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post(`${this.baseUrl}/upload`, formData, config);
        return response.data;
    } catch (error) {
        console.error('Error uploading file', error);
        throw error;
    }
}

  async getImage(imageId: string): Promise<Blob> {
    try {
      const response = await axios.get(`${this.baseUrl}/image/${imageId}`, { responseType: 'blob' });
      return response.data;
    } catch (error) {
      console.error('Error fetching image', error);
      throw error;
    }
  }

  async deleteImage(imageId: string): Promise<any> {
    try {
      const response = await axios.post(`${this.baseUrl}/delete`, null, {
        params: { imageId },
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting image', error);
      throw error;
    }
  }
  
  async getImages(): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/images`);
      return response.data;
    } catch (error) {
      console.error('Error fetching images', error);
      throw error;
    }
  }

  getImageUrl(imageId: string): string {
    return `${this.baseUrl}/image/${imageId}`;
  }
}
