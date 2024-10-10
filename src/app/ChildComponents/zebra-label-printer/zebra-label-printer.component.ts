import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LabelPrinterComponent } from '../label-printer/label-printer.component';
import { OcrService } from '../../Services/ocr.service';

@Component({
  selector: 'app-zebra-label-printer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './zebra-label-printer.component.html',
  styleUrl: './zebra-label-printer.component.css'
})
export class ZebraLabelPrinterComponent {
  @Input() items: any = [];
  @Output() labelPrinted = new EventEmitter<string>();

  constructor(public dialog: MatDialog, private ocrServ: OcrService){}

  onPrintLabel(item: any) {
    // Logic to print the label for the item
    const dialogConfig = new MatDialogConfig();

    const dialogRef = this.dialog.open(LabelPrinterComponent, {
      width : '500px',  // Set width to avoid excessive stretching
       //height : '320px',
      data: item
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('The dialog was closed');
      if(result === 'labelPrinted'){
        this.ocrServ.UpdateSellingPrice(item.ItemId, item.salvageAmount).subscribe(res => {
          if(res === true){
            this.labelPrinted.emit('saved');
          }
        })
      }
    });
  }
}
