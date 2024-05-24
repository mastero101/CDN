import { Component, OnInit } from '@angular/core';
import { CdnService } from '../cdn.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { PageEvent } from '@angular/material/paginator';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { ImageDialogComponent } from '../image-dialog/image-dialog.component';
import { VideoDialogComponent } from '../video-dialog/video-dialog.component';

@Component({
  selector: 'app-images',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatPaginatorModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule
  ],
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss']
})
export class ImagesComponent implements OnInit {
  images: string[] = [];
  filteredImages: string[] = [];
  paginatedImages: string[] = [];
  pageSize = 15;
  pageIndex = 0;
  searchTerm: string = '';

  constructor(private cdnService: CdnService, private dialog: MatDialog) {}

  ngOnInit() {
    this.loadImages();
  }

  async loadImages() {
    try {
      const response = await this.cdnService.getImages();
      this.images = response.images;
      this.filterImages();
    } catch (error) {
      console.error('Error loading images', error);
    }
  }

  filterImages() {
    this.pageIndex = 0;  // Reset the page index whenever a new search term is entered
    this.filteredImages = this.images.filter(image => 
      image.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.paginateImages();
  }

  async onDelete(imageUrl: string) {
    try {
      if (!imageUrl) {
        console.error('Image URL is undefined or null');
        return;
      }
      const imageId = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
      await this.cdnService.deleteImage(imageId); // Make sure imageId is correctly extracted
      this.images = this.images.filter(img => img !== imageUrl);
      this.filterImages();
    } catch (error) {
      console.error('Error deleting image', error);
    }
  }

  changePage(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.paginateImages();
  }

  paginateImages() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedImages = this.filteredImages.slice(startIndex, endIndex);
  }

  openImageDialog(imageUrl: string, imageId: string) {
    this.dialog.open(ImageDialogComponent, {
      data: { imageUrl, imageId }
    });
  }

  openVideoDialog(imageUrl: string) {
    const imageId = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
    this.dialog.open(VideoDialogComponent, {
      data: { imageUrl, imageId },
    });
  }

  isVideo(fileName: string): boolean {
    return fileName.endsWith('.mp4');
  }
}
