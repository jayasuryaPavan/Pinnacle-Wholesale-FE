import { CommonModule } from '@angular/common';
import { AfterContentChecked, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ItemNumberDialogComponent } from '../../ChildComponents/item-number-dialog/item-number-dialog.component';
import { OcrUploadComponent } from "../ocr-upload/ocr-upload.component";
import { FormsModule } from '@angular/forms';
import { OcrService } from '../../Services/ocr.service';
import { ZebraLabelPrinterComponent } from "../../ChildComponents/zebra-label-printer/zebra-label-printer.component";
import { LogoCanvasComponent } from '../../ChildComponents/logo-canvas/logo-canvas.component';

@Component({
  selector: 'app-add-stock',
  standalone: true,
  imports: [CommonModule, OcrUploadComponent, FormsModule, ZebraLabelPrinterComponent, LogoCanvasComponent],
  templateUrl: './add-stock.component.html',
  styleUrl: './add-stock.component.css'
})
export class AddStockComponent implements AfterContentChecked{
  receivedItems = 29;
  totalCount = 0;
  isSearchDisabled: boolean = false;
  searchedBarcode: String = '';
  items: any = [{
		"ItemId": "1324325",
		"Description": "STRUBS HOT PEPPERS",
		"ItemQuantity": 1,
		"SellPrice": "6.49",
		"ExtSellPrice": "6.49",
		"SalvagePercentage": "0.00",
		"SalvageAmount": "0.00",
    "Barcode": 6562196415
	}];
  isLabelPrinter: boolean = true;

  constructor( public dialog: MatDialog, private ocrServ: OcrService){}

  ngAfterContentChecked(): void {
    this.totalCount = this.items.length;
  }


  openDialog(): void {

    const dialogRef = this.dialog.open(ItemNumberDialogComponent, {
      width : 'auto',  // Set width to avoid excessive stretching
      height : 'auto',
      data: { barcode: this.searchedBarcode, itemNumber: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.isSearchDisabled = false;
      if(result.msg === 'confirm'){
        this.ocrServ.getProductInfoByItemId(result.data.itemNumber).subscribe(res => {
          console.log('productInfo-->', res);
        })
      }
    });
  }

  searchItem(barcode: String){
    console.log('inside the searchItem',barcode);
    this.searchedBarcode = barcode;
    this.isSearchDisabled = true;
    if(true){
      // this.openDialog();
    }
  }
}