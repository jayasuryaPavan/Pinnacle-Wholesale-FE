import { Component } from '@angular/core';
import { OcrService } from '../../Services/ocr.service';
import { CommonModule } from '@angular/common';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.min.mjs`;

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
      fileReader.onload = async (e: any) => {

        // this.extractTextFromPDF(e.target.result);
        const typedArray = new Uint8Array(e.target.result as ArrayBuffer);

        try {
          const pdfDoc = await pdfjsLib.getDocument(typedArray).promise;
          console.log('PDF Document loaded:', pdfDoc);
          let text = '';

          for (let pageNum = 1; pageNum <= (pdfDoc).numPages; pageNum++) {
            const page = await pdfDoc.getPage(pageNum);
            const content = await page.getTextContent();
            const pageText = content.items.map(item => (item as any).str).join(' ');
            text += `${pageText}\n\n`;
          }

          this.extractedText = text;
          this.isLoading = false;
        } catch (error) {
          console.error('Error loading PDF document:', error);
          this.isLoading = false;
        }
      };

      fileReader.readAsArrayBuffer(file);
    } else {
      alert('Please upload a valid PDF file.');
    }
  }
}
