import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { CdnService } from '../cdn.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})

export class UploadComponent {
  selectedFiles: File[] = [];
  uploadProgress: number | undefined;
  uploadedBytes: number = 0;
  totalBytes: number = 0;
  startTime: number = 0;
  endTime: number = 0;

  constructor(private cdnService: CdnService, private snackBar: MatSnackBar) {}

  onFileSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  async onUpload() {
    if (!this.selectedFiles || this.selectedFiles.length === 0) {
        alert('No files selected!');
        return;
    }
  
    try {
        // Reiniciar el progreso de carga
        this.uploadProgress = 0;
        this.uploadedBytes = 0;
        this.totalBytes = Array.from(this.selectedFiles).reduce((acc, file: File) => acc + file.size, 0);
        this.startTime = Date.now();
  
        // Iterar sobre todos los archivos seleccionados y súbelos por separado
        for (let i = 0; i < this.selectedFiles.length; i++) {
            const file = this.selectedFiles[i];
  
            const formData = new FormData();
            formData.append('file', file);
  
            // Configurar una función de progreso para actualizar el progreso de carga
            const config = {
                onUploadProgress: (progressEvent: any) => {
                    // Sumar el progreso de carga actual al contador total de bytes subidos
                    this.uploadedBytes += progressEvent.loaded;
  
                    // Calcular el progreso total de carga como porcentaje del tamaño total
                    this.uploadProgress = Math.round((this.uploadedBytes / this.totalBytes) * 100);
                    this.endTime = Date.now();
                }
            };
  
            // Subir el archivo con la función de progreso configurada
            const response = await this.cdnService.uploadFile(file, config);
  
            // Simular un retraso de 500ms antes de subir el próximo archivo
            await new Promise(resolve => setTimeout(resolve, 100));
        }
  
        // Restablecer el progreso de carga después de que se hayan subido todos los archivos
        this.uploadProgress = 100; // Asegúrate de que la barra de progreso llegue al 100% al finalizar la carga
        // Mostrar snackbar de confirmación
        this.snackBar.open('¡La carga de archivos ha sido exitosa!', 'Cerrar', {
            duration: 3000 // Duración del snackbar en milisegundos
        });
      } catch (error) {
          console.error('Error uploading files', error);
          // Restablecer el progreso de carga en caso de error
          this.uploadProgress = undefined;
      }
    }  

  getUploadedMegabytes(): number {
    return this.uploadedBytes / (1024 * 1024);
  }

  getUploadSpeed(): number {
    const totalTimeInSeconds = (this.endTime - this.startTime) / 1000;
    const uploadedMegabytes = this.getUploadedMegabytes();
    return uploadedMegabytes / totalTimeInSeconds;
  }
}


