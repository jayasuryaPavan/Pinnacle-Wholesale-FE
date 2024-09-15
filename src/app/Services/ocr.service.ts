import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Tesseract from 'tesseract.js';

@Injectable({
  providedIn: 'root'
})
export class OcrService {

  constructor(private http: HttpClient) { }

  // Recognize text using Tesseract
  recognizeText(image: File): Promise<string> {
    return Tesseract.recognize(image, 'eng', {
      logger: (m) => console.log(m)
    }).then(({ data: { text } }) => {
      return text; // Return the extracted text
    });
  }

  // Convert Base64 image to Blob (Utility function)
  convertBase64ToBlob(base64Image: string): Blob {
    const byteString = atob(base64Image.split(',')[1]);
    const mimeString = base64Image.split(',')[0].split(':')[1].split(';')[0];
    
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(arrayBuffer);
    
    for (let i = 0; i < byteString.length; i++) {
      uintArray[i] = byteString.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: mimeString });
  }
}
