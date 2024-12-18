import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Tesseract from 'tesseract.js';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OcrService {
  extractedText: any[] = [];
  // localProduct = 'http://localhost:12325/Product/';
  localProduct = 'http://localhost:5000/Product/';

  receiptNumber: string = "";

  constructor(private http: HttpClient) { }

  // Recognize text using Tesseract
  recognizeText(image: File): Promise<any[]> {
    return Tesseract.recognize(image, 'eng', {
      logger: (m) => {}
    }).then(({ data: { text } }) => {
      console.log(text);
      this.extractedText.push(text);
      return this.parseReceiptText(text); // Return the extracted text
    });
  }

  parseReceiptText(receiptText: string): any[] {
    const lines = receiptText.split('\n');

    let startIndex = lines.findIndex(line => line.includes('QTY') || line.includes('DESCRIPTION'));
  
    // Extract lines starting from the 7th line and ending before the "TOTAL SELL"
    const itemLines = lines.slice(startIndex + 1, lines.findIndex(line => line.includes('TOTAL SELL')));

    // return lines.toString();
  
    // Process the lines to create objects representing each item
    return itemLines.map(line => {
      const parts = line.trim().split(/\s+/); // Split line by spaces
    
      // Regular expression to check if a value contains alphabets
      const hasAlphabets = /[a-zA-Z]/;
    
      // Ensure ItemId is not empty
      if (!parts[0]) {
        return
      }
    
      // Ensure SellPrice and ExtSellPrice do not contain alphabets
      const sellPricePart = parts[parts.length - 1];
      const extSellPricePart = sellPricePart;
    
      if (hasAlphabets.test(sellPricePart)) {
        return
      }

      const cleanQuantity = (quantityStr: string) => {
        // Convert special cases like "1:00" or "1100" to "1.00"
        let cleanedQuantity = quantityStr.replace(':', '.'); // Replace ":" with "."
        
        if (cleanedQuantity === '1100') {
          cleanedQuantity = '1.00'; // Convert "1100" to "1.00"
        }
    
        // Parse as a floating-point number and return as an integer if needed
        let parsedQuantity = parseInt(cleanedQuantity);
        return parsedQuantity === 1 ? parsedQuantity : Math.floor(parsedQuantity);
      };
    
      // Process ItemQuantity, ensuring it's handled correctly
      const itemQuantityPart = parts[parts.length - 2] ? cleanQuantity(parts[parts.length - 2]) : 1;

      return {
        ItemId: parts[0],
        Description: parts.slice(1, 4).join(' ').replace(/'/g, ""), // Combine all parts except the last 3
        ItemQuantity: itemQuantityPart ? itemQuantityPart : 1,  // Second-to-last part is the quantity
        SellPrice: sellPricePart ? sellPricePart : "0.00",  // Second-to-last part is the sell price
        ExtSellPrice: extSellPricePart ? extSellPricePart : "0.00",  // Last part is the extended sell price
        SalvagePercentage: "0.00",
        SalvageAmount: "0.00",
        receiptNumber: this.receiptNumber,
      };
    }); 
  }

  // All the API calls are written below 

  loadNewBatch(reqPayload: any): Observable<any>{
    return this.http.post(this.localProduct+'loadNewBatch',reqPayload);
  }

  getProductInfoByItemId(itemId: any): Observable<any>{
    return this.http.get(`${this.localProduct}getProductInfoByItemId?productId=${itemId}`);
  }

  getProductInfoByBarcode(barcode: any): Observable<any>{
    return this.http.get(`${this.localProduct}getProductInfoByBarcode?barcode=${barcode}`);
  }

  getImportedData(): Observable<any> {
    return this.http.get(this.localProduct+"getImportedData");
  }

  UpdateBarcodeByItemId(itemId: string, barcode: string): Observable<any> {
    return this.http.post(`${this.localProduct}UpdateBarcodeByItemId?itemId=${itemId}&barcode=${barcode}`,{});
  }

  UpdateSellingPrice(itemId: string, ourSellingPrice: string): Observable<any> {
    return this.http.post(`${this.localProduct}UpdateSellingPrice?itemId=${itemId}&OurSellingPrice=${ourSellingPrice}`,{});
  }

  UpdateImportDataInfo(item: any): Observable<any>{
    return this.http.post(this.localProduct+"UpdateImportDataInfo",item);
  }

  DeleteProductFromImportedData(item: any): Observable<any>{
    return this.http.post(this.localProduct+"DeleteProductFromImportedData?itemId="+item.itemId,{});
  }

  AddProductToImportedData(item: any): Observable<any>{
    return this.http.post(this.localProduct+"AddProductToImportedData",item);
  }

  GetAvailableProductQuantityByBarcode(barcode: string): Observable<any>{
    return this.http.get(this.localProduct + "GetAvailableProductQuantityByBarcode?barcode="+barcode);
  }

  GetAvailableProductQuantityByItemId(itemId: string): Observable<any>{
    return this.http.get(this.localProduct + "GetAvailableProductQuantityByItemId?itemId="+itemId);
  }

  DeleteAllImportedData(): Observable<any>{
    return this.http.post(this.localProduct+"DeleteAllImportedData",{});
  }
}
