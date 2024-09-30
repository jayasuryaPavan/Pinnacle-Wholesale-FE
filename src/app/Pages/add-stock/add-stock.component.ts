import { CommonModule } from '@angular/common';
import { AfterContentChecked, Component, OnChanges } from '@angular/core';
import { itemsData } from '../../Services/data';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ItemNumberDialogComponent } from '../../ChildComponents/item-number-dialog/item-number-dialog.component';
import { LabelPrinterComponent } from '../../ChildComponents/label-printer/label-printer.component';
import { OcrUploadComponent } from "../ocr-upload/ocr-upload.component";
import { FormsModule } from '@angular/forms';
import { OcrService } from '../../Services/ocr.service';

@Component({
  selector: 'app-add-stock',
  standalone: true,
  imports: [CommonModule, OcrUploadComponent, FormsModule],
  templateUrl: './add-stock.component.html',
  styleUrl: './add-stock.component.css'
})
export class AddStockComponent implements AfterContentChecked{
  receivedItems = 29;
  totalCount = 0;
  isSearchDisabled: boolean = false;
  searchedBarcode: String = '';
  items: any = [];
  // searchText: String = '';

  constructor( public dialog: MatDialog, private ocrServ: OcrService){
 
  }

  ngAfterContentChecked(): void {
    this.totalCount = this.items.length;
    console.log(this.items)
  }


  openDialog(): void {

    const dialogConfig = new MatDialogConfig();

    const dialogRef = this.dialog.open(ItemNumberDialogComponent, {
      width : 'auto',  // Set width to avoid excessive stretching
      height : 'auto',
      data: { barcode: this.searchedBarcode, itemNumber: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result); // The result will have the recipient and message
    });
  }

  searchItem(barcode: String){
    console.log('inside the searchItem',barcode);
    this.searchedBarcode = barcode;
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