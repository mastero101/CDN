import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-image-detail',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './image-detail.component.html',
  styleUrl: './image-detail.component.scss'
})
export class ImageDetailComponent {
  @Input() imageId!: string;
}
