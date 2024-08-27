import { Component } from '@angular/core';
import { OcrService } from '../../Services/ocr.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ocr-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ocr-upload.component.html',
  styleUrl: './ocr-upload.component.css'
})

export class OcrUploadComponent {
  isLoading: boolean = false;
  extractedText: any;

  constructor(private ocrService: OcrService){ }
  
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.isLoading = true;
      this.ocrService.recognizeText(file).then(text => {
        this.extractedText = text;
        this.isLoading = false;
      }).catch(error => {
        console.error(error);
        this.isLoading = false;
      });
    }
  }
}
