import { CommonModule } from '@angular/common';
import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ItemNumberDialogComponent } from '../../ChildComponents/item-number-dialog/item-number-dialog.component';
import { OcrUploadComponent } from "../ocr-upload/ocr-upload.component";
import { FormsModule } from '@angular/forms';
import { OcrService } from '../../Services/ocr.service';
import { ZebraLabelPrinterComponent } from "../../ChildComponents/zebra-label-printer/zebra-label-printer.component";
import { LogoCanvasComponent } from '../../ChildComponents/logo-canvas/logo-canvas.component';
import { PrinterStatusComponent } from '../../ChildComponents/printer-status/printer-status.component';

@Component({
  selector: 'app-add-stock',
  standalone: true,
  imports: [CommonModule, OcrUploadComponent, FormsModule, ZebraLabelPrinterComponent, LogoCanvasComponent],
  templateUrl: './add-stock.component.html',
  styleUrl: './add-stock.component.css'
})
export class AddStockComponent implements AfterContentChecked, OnInit{
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
  isLabelPrinter: boolean = false;
  labelItem: any = [{
    "ItemId": "1324325",
		"Description": "STRUBS HOT PEPPERS",
		"ItemQuantity": 1,
		"SellPrice": "6.49",
		"ExtSellPrice": "6.49",
		"SalvagePercentage": "0.00",
		"SalvageAmount": "0.00",
    "Barcode": 6562196415
  }]
  totalQuant: number = 0;

  constructor( public dialog: MatDialog, private ocrServ: OcrService){}

  ngAfterContentChecked(): void {
    this.totalCount = this.items.length;
  }

  ngOnInit(): void {
    this.getImportedData();
  }

  getImportedData(): void{
    this.ocrServ.getImportedData().subscribe((res: any) => {
      this.isLabelPrinter = false;
      console.log("imported--->",res)
      this.items = [];
      this.totalQuant = 0;
      for(let item of res){
        this.items.push({
          "ItemId": item.itemId,
          "Description": item.description,
          "ItemQuantity": item.itemQuantity,
          "SellPrice": item.sellPrice,
          "ExtSellPrice": item.extSellPrice,
          "SalvagePercentage": "0.00",
          "SalvageAmount": "0.00"
        })  
        this.totalQuant+=item.itemQuantity;
      }
    })
  }

  labelPrinted(): void{
    this.getImportedData();
  }

  printerStatus(): void{
    const dialogRef = this.dialog.open(PrinterStatusComponent, {
      width : 'auto',  // Set width to avoid excessive stretching
      height : 'auto',
      data: { barcode: this.searchedBarcode, itemNumber: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("Printer Status-->", result);
    })
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
        this.ocrServ.UpdateBarcodeByItemId(result.data.itemNumber, result.data.barcode).subscribe(item => {
          if(item.id !== 0){
            this.isLabelPrinter = true;
            this.labelItem = [];
            console.log('productInfo-->', item);
            this.labelItem.push({
              "ItemId": item.itemId,
              "Description": item.description,
              "ItemQuantity": item.itemQuantity,
              "SellPrice": item.sellPrice,
              "ExtSellPrice": item.extSellPrice,
              "Barcode": item.barcodeValue,
              "SalvagePercentage": "0.00",
              "SalvageAmount": item.salvageAmount
            })
          }
        })
      }
    });
  }

  searchItem(barcode: String){
    this.searchedBarcode = barcode;
    this.isSearchDisabled = true;
    // this.openDialog();
    this.ocrServ.getProductInfoByBarcode(barcode).subscribe(item => {
      if(item.id === 0)
        this.openDialog();
      else{
        this.isLabelPrinter = true;
        this.labelItem = [];
        this.labelItem.push({
          "ItemId": item.itemId,
          "Description": item.description,
          "ItemQuantity": item.itemQuantity,
          "SellPrice": item.sellPrice,
          "ExtSellPrice": item.extSellPrice,
          "Barcode": item.barcodeValue,
          "SalvagePercentage": "0.00",
          "SalvageAmount": "0.00"
        })
      }
    })
  }
}