import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

export interface DialogData {
  itemNumber: any;
  barcode: string;
}

@Component({
  selector: 'app-item-number-dialog',
  standalone: true,
  imports: [ MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule, FormsModule
  ],
  templateUrl: './item-number-dialog.component.html',
  styleUrl: './item-number-dialog.component.css'
})
export class ItemNumberDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ItemNumberDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
