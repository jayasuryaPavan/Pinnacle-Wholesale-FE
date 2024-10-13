import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import ZebraBrowserPrintWrapper from 'zebra-browser-print-wrapper-https';

@Component({
  selector: 'app-printer-status',
  standalone: true,
  imports: [
    CommonModule,          
    MatDialogModule,       
    MatButtonModule  ],
  templateUrl: './printer-status.component.html',
  styleUrl: './printer-status.component.css'
})
export class PrinterStatusComponent implements OnInit{

  isPrinterConnected: boolean = false;
  
  async ngOnInit() {
    
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

    } catch (error: any) {
        throw new Error(error);
    }
  }
}
