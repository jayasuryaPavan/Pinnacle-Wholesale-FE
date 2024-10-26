import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { OcrService } from '../../Services/ocr.service';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-imported-data',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './imported-data.component.html',
  styleUrl: './imported-data.component.css'
})
export class ImportedDataComponent {

  importedData: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<ImportedDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ocrServ: OcrService
  ) {
    this.importedData = this.ocrServ.extractedText;
  }

  onNoClick(): void {
    this.dialogRef.close({msg: 'close'});
  }

  formatText(text: string): string{
    return text.replace(/\n/g, '<br>');
  }
}
