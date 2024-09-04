import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { itemsData } from '../../Services/data';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ItemNumberDialogComponent } from '../../ChildComponents/item-number-dialog/item-number-dialog.component';
import { LabelPrinterComponent } from '../../ChildComponents/label-printer/label-printer.component';
import { OcrUploadComponent } from "../ocr-upload/ocr-upload.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-stock',
  standalone: true,
  imports: [CommonModule, OcrUploadComponent, FormsModule],
  templateUrl: './add-stock.component.html',
  styleUrl: './add-stock.component.css'
})
export class AddStockComponent {
  receivedItems = 29;
  totalCount = 0;
  isSearchDisabled: boolean = false;
  // searchText: String = '';

  constructor( public dialog: MatDialog ){
    this.totalCount = itemsData.items.length;
  }

  items = itemsData.items;


  openDialog(): void {

    const dialogConfig = new MatDialogConfig();

    const dialogRef = this.dialog.open(ItemNumberDialogComponent, {
      width : '600px',  // Set width to avoid excessive stretching
      // height : 'auto',
      data: { recipient: '', message: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result); // The result will have the recipient and message
    });
  }

  searchItem(itemNumber: String){
    console.log('inside the searchItem',itemNumber);
    this.isSearchDisabled = true;
    if(true){
      this.openDialog();
    }
  }

  onPrintLabel(item: any) {
    // Logic to print the label for the item
    const dialogConfig = new MatDialogConfig();

    const dialogRef = this.dialog.open(LabelPrinterComponent, {
      width : '500px',  // Set width to avoid excessive stretching
       //height : '320px',
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result); // The result will have the recipient and message
    });
  }
}