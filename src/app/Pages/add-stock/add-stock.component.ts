import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ItemNumberDialogComponent } from '../../ChildComponents/item-number-dialog/item-number-dialog.component';
import { OcrUploadComponent } from "../ocr-upload/ocr-upload.component";
import { FormsModule } from '@angular/forms';
import { OcrService } from '../../Services/ocr.service';
import { ZebraLabelPrinterComponent } from "../../ChildComponents/zebra-label-printer/zebra-label-printer.component";
import { LogoCanvasComponent } from '../../ChildComponents/logo-canvas/logo-canvas.component';
import { PrinterStatusComponent } from '../../ChildComponents/printer-status/printer-status.component';
import ZebraBrowserPrintWrapper from 'zebra-browser-print-wrapper';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { AddItemDialogComponent } from '../../ChildComponents/add-item-dialog/add-item-dialog.component';

@Component({
  selector: 'app-add-stock',
  standalone: true,
  imports: [CommonModule, OcrUploadComponent, FormsModule, ZebraLabelPrinterComponent, MatLabel, MatInput, MatFormField, MatCheckboxModule, LogoCanvasComponent],
  templateUrl: './add-stock.component.html',
  styleUrl: './add-stock.component.css'
})
export class AddStockComponent implements OnInit{
  receivedItems = 29;
  totalCount = 0;
  isSearchDisabled: boolean = false;
  searchedBarcode: String = '';
  items: any = [];
  labelItem: any = [];
  selectAll: boolean = false;
  // items: any = [{
  //   "Id": 0,
	// 	"ItemId": "1324325",
	// 	"Description": "STRUBS HOT PEPPERS",
	// 	"ItemQuantity": 1,
	// 	"SellPrice": "6.49",
	// 	"ExtSellPrice": "6.49",
	// 	"SalvagePercentage": "0.00",
	// 	"SalvageAmount": "0.00",
  //   "Barcode": 6562196415
	// }];
  isLabelPrinter: boolean = false;
  // labelItem: any = [{
  //   "Id": 0,
  //   "ItemId": "1324325",
	// 	"Description": "STRUBS HOT PEPPERS",
	// 	"ItemQuantity": 1,
	// 	"SellPrice": "6.49",
	// 	"ExtSellPrice": "6.49",
	// 	"SalvagePercentage": "0.00",
	// 	"SalvageAmount": "0.00",
  //   "Barcode": 6562196415
  // }]
  totalQuant: number = 0;
  isPrinterConnected: boolean = false;

  constructor( public dialog: MatDialog, private ocrServ: OcrService){}

  ngOnInit(): void {
    this.isSearchDisabled = false;
    this.getImportedData();
  }

  getImportedData(): void{
    this.ocrServ.getImportedData().subscribe((res: any) => {
      this.isLabelPrinter = false;
      console.log("imported--->",res)
      this.items = [];
      this.totalQuant = 0;
      this.totalCount = 0;
      for(let item of res){
        this.items.push({
          "Id": item.id || item.Id,
          "ItemId": item.ItemId || item.itemId,
          "Description": item.Description || item.description,
          "ItemQuantity": item.ItemQuantity || item.itemQuantity,
          "SellPrice": item.SellPrice || item.sellPrice,
          "ExtSellPrice": item.ExtSellPrice || item.extSellPrice,
          "SalvagePercentage": item.salvagePercentage || item.SalvagePercentage,
          "SalvageAmount": item.SalvageAmount || item.salvageAmount,
          "ReceiptNumber": item.receiptNumber || item.ReceiptNumber,
        })  
        this.totalCount = this.items.length;
        this.totalQuant+=item.itemQuantity;
      }
    })
  }

  labelPrinted(): void{
    this.getImportedData();
  }

  toggleAllItems(selectAll: boolean): void {
    this.items.forEach((item : any) => {
      item.selected = selectAll; // Select or deselect all items
    });
  }

  checkSelectItem(): void {
    // Update the `selectAll` checkbox based on individual item selection
    this.selectAll = this.items.every((item : any) => item.selected);
  }

  deleteAllItems(): void{
    console.log("Delete All Items");
    this.ocrServ.DeleteAllImportedData().subscribe(res=>{
      if(res === true){
        const dialogRef = this.dialog.open(PrinterStatusComponent,{
          width : 'auto',
          height: 'auto',
          data: { isSuccess: true, message: "Deleted All the Items Succesfully"}
        })

        dialogRef.afterClosed().subscribe(res =>{ 
          this.getImportedData();
        })
      }
      else{
        const dialogRef = this.dialog.open(PrinterStatusComponent,{
          width : 'auto',
          height: 'auto',
          data: { isError: true, message: "There is some Unexpected Error, Cannot delete all the Items"}
        })
      }
    })
  }

  async printerStatus(){
    
    try {

      // Create a new instance of the object
      const browserPrint =  new ZebraBrowserPrintWrapper();

      console.log(browserPrint.getAvailablePrinters())

      // Select default printer
      const defaultPrinter =  await browserPrint.getDefaultPrinter();
  
      // Set the printer
      browserPrint.setPrinter(defaultPrinter);

      // Check printer status
      const printerStatus = await browserPrint.checkPrinterStatus();

      this.isPrinterConnected = printerStatus.isReadyToPrint;

      const dialogRef = this.dialog.open(PrinterStatusComponent, {
        width : 'auto',  // Set width to avoid excessive stretching
        height : 'auto',
        data: { isError: false, isPrinterConnected: this.isPrinterConnected }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log("Printer Status-->", result);
      })

    } catch (error: any) {

      const dialogRef = this.dialog.open(PrinterStatusComponent, {
        width : 'auto',  // Set width to avoid excessive stretching
        height : 'auto',
        data: { isError: true, message: error }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log("Printer Status-->", result);
      })
    }
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
            this.totalCount = this.labelItem.length;
            this.totalQuant = item.itemQuantity;
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
          "SalvagePercentage": item.salvagePercentage,
          "SalvageAmount": item.salvageAmount
        })
        this.totalCount = this.labelItem.length;
        this.totalQuant = item.itemQuantity;
      }
    })
  }

  updateItem(item: any){
    item.selected = false;
    let reqPayload = {
      "id": item.Id,
      "itemId": item.ItemId,
      "description": item.Description,
      "itemQuantity": item.ItemQuantity,
      "sellPrice": item.SellPrice,
      "extSellPrice": item.ExtSellPrice,
      "salvagePercentage": item.SalvagePercentage,
      "salvageAmount": item.SalvageAmount,
      "isLabelPrinted": false,
      "receiptNumber": item.ReceiptNumber,
    }
    this.ocrServ.UpdateImportDataInfo(reqPayload).subscribe(res => {
      if(res === true){
        this.getImportedData();
      }
    })
  }

  deleteItem(item: any){
    item.selected = false;
    let reqPayload = {
      "id": item.Id,
      "itemId": item.ItemId,
      "description": item.Description,
      "itemQuantity": item.ItemQuantity,
      "sellPrice": item.SellPrice,
      "extSellPrice": item.ExtSellPrice,
      "salvagePercentage": item.SalvagePercentage,
      "salvageAmount": item.SalvageAmount,
      "isLabelPrinted": false
    }
    this.ocrServ.DeleteProductFromImportedData(reqPayload).subscribe(res => {
      if(res === true){
        this.getImportedData();
      }
    })
  }

  searchProduct(){
    const dialogRef = this.dialog.open(AddItemDialogComponent, {
      width : 'auto',  // Set width to avoid excessive stretching
      height : 'auto',
      data: { isAddItem: false }
    })

    dialogRef.afterClosed().subscribe(res => {
      if(res.msg === "confirm"){
        if(res.data.itemNumber && res.data.itemNumber != "" && res.data.itemNumber != null){
          this.ocrServ.GetAvailableProductQuantityByItemId(res.data.itemNumber).subscribe(item=>{
            if(!item || item.id == 0) {
              const dialogRef = this.dialog.open(PrinterStatusComponent, {
                width : 'auto',  // Set width to avoid excessive stretching
                height : 'auto',
                data: { isError: true, message: "!!!Item Number Not Found or This  item may  not be into the Inventory!!!" }
              });
            }
            else {
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
                this.totalCount = this.labelItem.length;
                this.totalQuant = item.itemQuantity;
            }
          });
        }
        else if(res.data.barcode && res.data.barcode != "" && res.data.barcode != null){
          this.ocrServ.GetAvailableProductQuantityByBarcode(res.data.barcode).subscribe(item=>{
            if(!item || item.id == 0) {
              const dialogRef = this.dialog.open(PrinterStatusComponent, {
                width : 'auto',  // Set width to avoid excessive stretching
                height : 'auto',
                data: { isError: true, message: "!!!Barcode Not Found!!!" }
              });
            }
            else {
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
                this.totalCount = this.labelItem.length;
                this.totalQuant = item.itemQuantity;
            }
          });
        }
      }
    })
  }

  addItem(){
    const dialogRef = this.dialog.open(AddItemDialogComponent, {
      width : 'auto',  // Set width to avoid excessive stretching
      height : 'auto',
      data: { isAddItem: true }
    });

    dialogRef.afterClosed().subscribe(res => {
      if(res.msg === "confirm"){
        let item = res.data;
        let reqPayload = {
          "itemId": item.itemNumber,
          "description": item.description,
          "itemQuantity": item.quantity,
          "sellPrice": item.msrp,
          "extSellPrice": item.msrp,
          "salvagePercentage": "0.00",
          "salvageAmount": "0.00",
          "receiptNumber": item.receiptNumber
        }
        this.ocrServ.AddProductToImportedData(reqPayload).subscribe(res => {
          if(res === true){
            this.ocrServ.UpdateBarcodeByItemId(item.itemNumber, item.barcode).subscribe(item => {
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
                this.totalCount = this.labelItem.length;
                this.totalQuant = item.itemQuantity;
              }
            })
          }
          else{
            this.getImportedData();
          }
        })
      }
    })
  }
}