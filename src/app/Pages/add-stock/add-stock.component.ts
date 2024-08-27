import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { itemsData } from '../../Services/data';

@Component({
  selector: 'app-add-stock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-stock.component.html',
  styleUrl: './add-stock.component.css'
})
export class AddStockComponent {
  receivedItems = 29;
  constructor(){}

  items = itemsData.items;


  onUploadPdf(event: any) {
    // Handle the PDF upload logic
  }

  onGenerateTable() {
    // Logic to generate the table based on the uploaded PDF or other data
  }

  onPrintLabel(itemId: string) {
    // Logic to print the label for the item
  }

  onFilterSales() {
    // Filter logic for sales
  }

  onFilterStatus() {
    // Filter logic for status
  }
}