import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { itemsData } from '../../Services/data';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ItemNumberDialogComponent } from '../../ChildComponents/item-number-dialog/item-number-dialog.component';
import { LabelPrinterComponent } from '../../ChildComponents/label-printer/label-printer.component';
import { OcrUploadComponent } from "../ocr-upload/ocr-upload.component";

@Component({
  selector: 'app-add-stock',
  standalone: true,
  imports: [CommonModule, OcrUploadComponent],
  templateUrl: './add-stock.component.html',
  styleUrl: './add-stock.component.css'
})
export class AddStockComponent {
  receivedItems = 29;
  totalCount = 0;

  constructor( public dialog: MatDialog ){
    this.totalCount = itemsData.items.length;
  }

  items = itemsData.items;


  openDialog(event: MouseEvent): void {

    const dialogConfig = new MatDialogConfig();

    // Set the position of the dialog to be at the click location
    dialogConfig.position = {
      top: `${event.clientY}px`,
      left: `${event.clientX}px`
    };

    const dialogRef = this.dialog.open(ItemNumberDialogComponent, {
      // width : '600px',  // Set width to avoid excessive stretching
      // height : 'auto',
      data: { recipient: '', message: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result); // The result will have the recipient and message
    });
  }

  onUploadPdf(event: any) {
    // Handle the PDF upload logic
  }

  onGenerateTable() {
    // Logic to generate the table based on the uploaded PDF or other data
  }

  onPrintLabel(itemId: string) {
    // Logic to print the label for the item
    const dialogConfig = new MatDialogConfig();

    const dialogRef = this.dialog.open(LabelPrinterComponent, {
      // width : '600px',  // Set width to avoid excessive stretching
      // height : '400px',
      data: { itrNum: itemId, barcode: 51656551622 }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result); // The result will have the recipient and message
    });
  }

  onFilterSales() {
    // Filter logic for sales
  }

  onFilterStatus() {
    // Filter logic for status
  }
}