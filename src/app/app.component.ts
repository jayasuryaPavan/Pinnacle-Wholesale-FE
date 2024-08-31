import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SearchPageComponent } from './Pages/search-page/search-page.component';
import { OcrUploadComponent } from "./Pages/ocr-upload/ocr-upload.component";
import { CommonModule } from '@angular/common';
import { AddStockComponent } from "./Pages/add-stock/add-stock.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, SearchPageComponent, OcrUploadComponent, AddStockComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

}
