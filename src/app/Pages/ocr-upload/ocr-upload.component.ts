import { Component, EventEmitter, Output } from '@angular/core';
import { OcrService } from '../../Services/ocr.service';
import { CommonModule } from '@angular/common';
import { GlobalWorkerOptions, getDocument, version } from 'pdfjs-dist';
import Pica from 'pica';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ImportedDataComponent } from '../../ChildComponents/imported-data/imported-data.component';

GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.mjs`;

@Component({
  selector: 'app-ocr-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ocr-upload.component.html',
  styleUrl: './ocr-upload.component.css'
})
export class OcrUploadComponent {
  @Output() loadImportedData = new EventEmitter<string>();

  isLoading: boolean = false;
  extractedText: any[] = [];
  extractedImages: string[] = [];
  pica = Pica(); // Initialize Pica for image processing

  constructor(private ocrService: OcrService, public dialog: MatDialog) {}

  async onFileSelected(event: any): Promise<void> {
    const file: File = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.isLoading = true;
      this.extractedText = [];
      const fileReader = new FileReader();
      fileReader.onload = async (e: any) => {
        const typedArray = new Uint8Array(e.target.result as ArrayBuffer);

        try {
          const pdf = getDocument(typedArray);
          const pdfDoc = await pdf.promise;
          
          for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
            const page = await pdfDoc.getPage(pageNum);
            const viewport = page.getViewport({ scale: 1.5 });

            // Create a canvas element to render the page
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d') as CanvasRenderingContext2D;
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            // Render the page to the canvas
            await page.render({ canvasContext: context, viewport }).promise;

            const imageData = canvas.toDataURL('image/png');

            // Create a new canvas for Pica processing
            const targetCanvas = document.createElement('canvas');
            targetCanvas.width = canvas.width;
            targetCanvas.height = canvas.height;

            // Resize and enhance the image with Pica
            const processedCanvas = await this.pica.resize(canvas, targetCanvas, {
              unsharpAmount: 1000, // Increase sharpness
              unsharpThreshold: 5,
            }); 

            // Add image processing to reduce noise and increase contrast
            this.reduceNoiseAndEnhanceContrast(processedCanvas);

            // Convert the processed canvas to a Blob and pass to Tesseract for OCR
            const blob = await new Promise<Blob>((resolve, reject) => {
              processedCanvas.toBlob((blob) => {
                if (blob) {
                  resolve(blob);
                } else {
                  reject(new Error('Canvas toBlob() returned null'));
                }
              }, 'image/png');
            });

            // Convert the blob to an Object URL and store it
            let newUrl = URL.createObjectURL(blob);
            this.extractedImages.push(newUrl);

            // Create a File object to pass to Tesseract
            const processedFile = new File([blob], `page_${pageNum}.png`, { type: 'image/png' });

            // Use the OcrService to perform OCR on the processed image
            const text = await this.ocrService.recognizeText(processedFile);
            this.extractedText.push(text); // Store the extracted text
          }
          this.openImportedData();
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

  openImportedData(){
    const dialogRef = this.dialog.open(ImportedDataComponent, {
      width : 'auto',  // Set width to avoid excessive stretching
      height : 'auto',
      data: { }
    });

    dialogRef.afterClosed().subscribe(res => {
      if(res.msg === 'confirm'){
        const reqPayload = this.extractedText.flat().filter(item => item !== null && item !== undefined);
        this.ocrService.loadNewBatch(reqPayload).subscribe(res =>{
          if(res === true){           
            this.loadImportedData.emit('loadImportedData');
          }
        })
      }
    })
  }

  // Function to reduce noise and enhance contrast
  reduceNoiseAndEnhanceContrast(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get the image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Apply contrast and noise reduction
    const contrast = 75;  // Adjust contrast value as needed
    const noiseReductionLevel = 0;  // Adjust noise reduction level as needed

    for (let i = 0; i < data.length; i += 4) {

      // Since the image is grayscale, we only need to modify one channel (red, green, and blue are the same)
      // Reduce noise by averaging neighboring pixel values (basic smoothing)
      const grayValue = this.smoothPixel(data, i, canvas.width, noiseReductionLevel);

      // Increase contrast
      const contrastedGrayValue = this.adjustContrast(grayValue, contrast);

      // Apply the same value to red, green, and blue channels
      data[i] = contrastedGrayValue;     // Red
      data[i + 1] = contrastedGrayValue; // Green
      data[i + 2] = contrastedGrayValue; // Blue

      // Alpha (opacity) channel remains unchanged (data[i + 3])

      // // Reduce noise by averaging neighboring pixel values (basic smoothing)
      // data[i] = this.smoothPixel(data, i, canvas.width, noiseReductionLevel);     // Red
      // data[i + 1] = this.smoothPixel(data, i + 1, canvas.width, noiseReductionLevel); // Green
      // data[i + 2] = this.smoothPixel(data, i + 2, canvas.width, noiseReductionLevel); // Blue

      // // Increase contrast
      // data[i] = this.adjustContrast(data[i], contrast);
      // data[i + 1] = this.adjustContrast(data[i + 1], contrast);
      // data[i + 2] = this.adjustContrast(data[i + 2], contrast);
    }

    // Put the processed data back into the canvas
    ctx.putImageData(imageData, 0, 0);
  }

  // Helper function to smooth a pixel by averaging neighboring pixel values
  smoothPixel(data: Uint8ClampedArray, index: number, width: number, level: number) {
    const totalPixels = (level * 2 + 1) ** 2;
    let sum = 0;
  
    for (let i = -level; i <= level; i++) {
      for (let j = -level; j <= level; j++) {
        const idx = index + (i * width + j) * 4;
        if (idx >= 0 && idx < data.length) {
          sum += data[idx];  // Only the grayscale value
        }
      }
    }
  
    return sum / totalPixels;
  }
  

  // Helper function to adjust contrast
  adjustContrast(value: number, contrast: number) {
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    return Math.min(255, Math.max(0, factor * (value - 128) + 128));
  }
}
