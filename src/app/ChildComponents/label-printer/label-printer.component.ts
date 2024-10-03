import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import JsBarcode from 'jsbarcode';
import { CommonModule } from '@angular/common';  // Import CommonModule if you need it
import ZebraBrowserPrintWrapper from 'zebra-browser-print-wrapper-https';

@Component({
  selector: 'app-label-printer',
  standalone: true,
  imports: [
    CommonModule,          
    MatDialogModule,       
    MatButtonModule     
  ],
  templateUrl: './label-printer.component.html',
  styleUrls: ['./label-printer.component.css']
})
export class LabelPrinterComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<LabelPrinterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    // Generate the barcode when the modal is opened
    this.generateBarcode(this.data.Barcode);
  }

  printDialog() {
    const printContents = document.getElementsByClassName('mat-dialog-content')[0].innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    window.print();

    document.body.innerHTML = originalContents;
    window.location.reload(); // To ensure the original content is restored correctly
  }

  generateBarcode(data: string): void {
    JsBarcode('#barcode', data, {
      format: 'CODE128',
      lineColor: 'black',
      width: 2,
      height: 80,
      displayValue: true
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async printBarcode(serial: any){

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

      // Check if the printer is ready
      if(printerStatus.isReadyToPrint) {

          // ZPL script to print a simple barcode
          const zpl = `^XA

          ^FX Top section with logo.
          ^FO250,3^GFA,4182,4182,41,,::::::::::hY07,hY0FCJ04I018,hX01FEJ0EI07C,hX01FF8001FI0FC,hX03FFC003F803FC,hX03IF007FC0FFE,hX07IFC0FFE1IF,hX07IFE1IF1IF,hX0KF8IF8IF8,hW01KFC3FFC7FF8,hW01LF1FFE3FFC,001hMFCL03LFC7FE1FFC,001hMFCL07LFE3FF1FFE,001hMFCL07MF8FF87FE,001C001FFC1F83FFC3E07FF87FFC0KF00IF0JFCJ07CL0NFC7FC7FF,0018I01FC1F81FFC3E03FF07FF80JF8001FE0JFCJ03CL0OF1FE3FF,0018J0FC1F80FFC3E03FF07FF807IFJ0FE0JFCJ03CK01OF87F1FF8,0018J07C1F80FFC3E01FF07FF007FFEJ07E0JFCJ03CK03OFE3F8FF8,0018J03C1F807FC3E01FF07FF007FFC03C03E0JFCJ07CK01PF8FC7FC,00181FE03C1F807F83E00FF07FF083FF80FF01E0JFC1JFCP0LFC7E3FC,00181FF83C1F803F83E007F07FE083FF81FFC1E0JFC1JFCR07JF1F1FE,00181FF83C0F801F83E007F07FE083FF03FFC3E0JFC1JFCS01IF8F8FE,00181FF83C0F841F83E083F07FE1C1FF03JFE0JFC1JFCL07FFL03FE3C7F,00181FF83C0F860F83E083F07FC1C1FF07JFE0JFC1JFCJ01LFK03F8E3F,00181FF83C0F860F83E0C1F07FC1E0FF07JFE0JFC1JFCI01NFCJ03C61F8,00181FF03C0F860783E0C1F07FC1E0FF07JFE0JFCJ07CI0QFJ0708F8,00181FE03C0F870783E0E0F07F83E0FF07JFE0JFCJ07C003RFI03007C,0018J07C0F878383E0E0707F83F07F07JFE0JFCJ0FC01IFEK07JF8J03C,0018J0FC0F878383E0F0707F07F07F07JFE0JFCJ0FC03FFO0JFJ01E,0018I01FC0F87C183E0F8307FJ07F07JFE0JFC1JFC0F8R0IFJ0E,0018I07FC0F87C083E0F8307FJ03F07JFE0JFC1JFC18T0FFEI07,00181JFC0F87E0C3E0F8107EJ03F03JFE0JFC1JFCV01FFC003,00181JFC0F87E003E0FC107EJ03F03FFC3E0JFC1JFCW01FF8,00181JFC0F87F003E0FE007EJ01F81FFC1E0JFC1JFCX03FE,00181JFC0F87F803E0FE007C0FFC1F80FF81E0JF81JFCY07F8,00181JFC0F87F803E0FF007C1FFC1FC07F01E0JF81JFCg0FE,00181JFC0F87FC03E0FF007C1FFC0FCJ03EJ038J01Cg01FC,00181JFC0F87FC03E0FF80781FFE0FEJ07EJ038J01CgG07E,00181JFC0F87FE03E0FF80783FFE07FJ0FEJ03CJ01CgG01F8,00181JFC0F87FE03E0FFC0703IF07FC003FEJ03CJ01CgH03E,001gQFC1TFCgI0F8,001hMF8gI01C,001hMF8gJ0F,001hMFCgJ038,003hMFCgK0E,001hMFCgK03,001hMFCgL0C,003hMFgM04,001FC,,:::::::I04003K020CK03F8K06L0FCK03CS04L0FC,I04183K060CK079CK06L0FCK066L06L06L0FC,I06186K060CK0E06K06L0CL0CM06L06L08,I061C4K060CK0C06K06L0CL04M0FL06L0C,I0234CK060CK0803K06L0CL07M09L06L0C,I0324CK07FCK0803K06L0FCK03EL098K06L0FC,I01648K07FCK0803K06L0FCL0FK0198K06L0F8,I01E38K020CK0C03K06L0CM03K03FCK06L08,I01C3L020CK0C06K06L0CL0C3K03FCK06L08,J0C3L020CK060CK06L0CL0E3K0306K06L0C,J041L020CK03FCK07CK0FCK07EK0606K07CK0FC,R02M01FL03CK078K03CK0402K078K078,,:::::::::::::::::::::^FS

          ^FX Second section with Actual Selling Price and Store selling Price.
          ^CFA,25
          ^FO120,94^FDItem: ${this.data.ItemId}^FS
          ^FO120,130^FDMSRP: ${this.data.SellPrice}$^FS
          ^CF0,39
          ^FO440,105^FDOur Price: ${this.data.SalvageAmount}$^FS

          ^FX Third section with bar code.
          ^BY3,2,90
          ^FO200,170^BC^FD${this.data.Barcode}^FS

          ^XZ`

          browserPrint.print(zpl);
      } 
      else {
        console.log("Error/s", printerStatus.errors);
      }

    } catch (error: any) {
        throw new Error(error);
    }
  }
}
