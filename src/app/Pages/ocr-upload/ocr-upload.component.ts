import { Component } from '@angular/core';
import { OcrService } from '../../Services/ocr.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-ocr-upload',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
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

      // const reader = new FileReader();

      // reader.onload = () => {
      //   const base64Image = (reader.result as string).split(',')[1];
      //   this.ocrService.recognizeText(base64Image).subscribe(
      //     response => {
      //       this.extractedText = response.responses[0].fullTextAnnotation.text;
      //       console.log('Extracted Text:', this.extractedText);
      //     },
      //     error => {
      //       console.error('Error:', error);
      //     }
      //   );
      // };
      
      // reader.readAsDataURL(file);


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
