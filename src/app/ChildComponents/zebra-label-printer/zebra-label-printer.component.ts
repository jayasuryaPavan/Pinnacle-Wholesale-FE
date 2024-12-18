import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LabelPrinterComponent } from '../label-printer/label-printer.component';
import { OcrService } from '../../Services/ocr.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-zebra-label-printer',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './zebra-label-printer.component.html',
  styleUrl: './zebra-label-printer.component.css'
})
export class ZebraLabelPrinterComponent implements OnInit{
  @Input() items: any = [];
  @Output() labelPrinted = new EventEmitter<string>();

  constructor(public dialog: MatDialog, private ocrServ: OcrService){}

  ngOnInit(): void {
    this.items.forEach((item :any) => {
      this.changePrice(item,'price');
    })
  }

  changePrice(item:any, key:string){
    if(key === "percentage")
      item.SalvageAmount = ((item.SalvagePercentage * item.SellPrice) / 100).toFixed(2);
    else if(key === "price")
      item.SalvagePercentage = ((item.SalvageAmount * 100) / item.SellPrice).toFixed(0);
  }

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
      if(result === 'labelprinted'){ 
        this.ocrServ.UpdateSellingPrice(item.ItemId, item.SalvageAmount).subscribe(res => {
          if(res === true){
            this.labelPrinted.emit('saved');
          }
        })
      }
    });
  }
}
