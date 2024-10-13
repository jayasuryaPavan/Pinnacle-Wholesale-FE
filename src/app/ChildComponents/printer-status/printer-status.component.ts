import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

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
export class PrinterStatusComponent {

  constructor(
    public dialogRef: MatDialogRef<PrinterStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
    
}
