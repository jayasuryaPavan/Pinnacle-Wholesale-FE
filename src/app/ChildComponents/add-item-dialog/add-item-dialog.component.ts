import { Component, Inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-item-dialog',
  standalone: true,
  imports: [MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule, FormsModule, CommonModule],
  templateUrl: './add-item-dialog.component.html',
  styleUrl: './add-item-dialog.component.css'
})
export class AddItemDialogComponent {

  isAddItem:boolean = true;

  constructor(
    public dialogRef: MatDialogRef<AddItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any = {}
  ) {}

  onNoClick(): void {
    this.dialogRef.close({msg: 'close'});
  }
}
