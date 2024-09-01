import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from '../item-number-dialog/item-number-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import JsBarcode from 'jsbarcode';

@Component({
  selector: 'app-label-printer',
  standalone: true,
  imports: [
    MatDialogModule, 
    MatButtonModule,
    
  ],
  templateUrl: './label-printer.component.html',
  styleUrl: './label-printer.component.css'
})
export class LabelPrinterComponent {

  constructor(
    public dialogRef: MatDialogRef<LabelPrinterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    // Generate the barcode when the modal is opened
    this.generateBarcode(this.data.barcode);
  }

  generateBarcode(data: string): void {
    JsBarcode('#barcode', data, {
      format: 'CODE128',
      lineColor: '#0aa',
      width: 2,
      height: 100,
      displayValue: true
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

