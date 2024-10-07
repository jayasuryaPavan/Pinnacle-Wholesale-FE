import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-logo-canvas',
  templateUrl: './logo-canvas.component.html',
  styleUrls: ['./logo-canvas.component.css'],
  imports: [CommonModule],
  standalone: true,
})
export class LogoCanvasComponent implements AfterViewInit {

  @ViewChild('canvasLogo', { static: false }) canvas: ElementRef<HTMLCanvasElement> | undefined;

  private context: CanvasRenderingContext2D | null | undefined;

  ngAfterViewInit(): void {
    if(this.canvas){
      const canvasEl = this.canvas.nativeElement;
      this.context = canvasEl.getContext('2d');
      this.loadImageToCanvas();
    }
  }

  loadImageToCanvas(): void {
    const img = new Image();
    img.src = '../../../assets/Pinnacle_logo.jpg';  // Make sure the image is in the 'assets' folder
    img.onload = () => {
      if(this.context)
        this.context.drawImage(img, 0, 0, 250, 60);  // Adjust these dimensions as needed
    };
  }
}
