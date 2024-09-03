import { Component } from '@angular/core';
import { OcrService } from '../../Services/ocr.service';
import { CommonModule } from '@angular/common';
import * as pdfjsLib from 'pdfjs-dist';

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

  constructor(private ocrService: OcrService){
  }
  
  async onFileSelected(event: any): Promise<void> {
    const file: File = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.isLoading = true;
      this.extractedText = null;
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        const typedArray = new Uint8Array(fileReader.result as ArrayBuffer);
        const pdfDoc = await pdfjsLib.getDocument(typedArray).promise;
        let text = '';

        for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
          const page = await pdfDoc.getPage(pageNum);
          const content = await page.getTextContent();
          const pageText = content.items.map(item => (item as any).str).join(' ');
          text += `${pageText}\n\n`;
        }

        this.extractedText = text;
        this.isLoading = false;
      };

      fileReader.readAsArrayBuffer(file);
    } else {
      alert('Please upload a valid PDF file.');
    }
  }
}
