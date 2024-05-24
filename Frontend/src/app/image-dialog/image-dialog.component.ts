import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-image-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Image - {{ data.imageId }}</h2>
    <div class="dialog-content">
      <img [src]="data.imageUrl" alt="Image" class="dialog-image">
      <button mat-flat-button color="primary" (click)="close()">Close</button>
    </div>
  `,
  styleUrl: './image-dialog.component.scss'
})
export class ImageDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { imageUrl: string, imageId: string }
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
