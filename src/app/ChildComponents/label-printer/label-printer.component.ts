import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import JsBarcode from 'jsbarcode';
import { CommonModule } from '@angular/common';  // Import CommonModule if you need it

@Component({
  selector: 'app-label-printer',
  standalone: true,
  imports: [
    CommonModule,          // Add CommonModule if needed
    MatDialogModule,       // Correctly import MatDialogModule
    MatButtonModule        // Correctly import MatButtonModule
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
    this.generateBarcode(this.data.barcode);
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
}
