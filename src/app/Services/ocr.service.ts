import { Injectable } from '@angular/core';
import Tesseract from 'tesseract.js';

@Injectable({
  providedIn: 'root'
})
export class OcrService {

  constructor() { }

  recognizeText(image: File): Promise<string> {
    return Tesseract.recognize(image, 'eng', {
      logger: (m) => console.log(m)
    })
    .then(({ data: { text } }) => {
      return this.transformData(text);
    })
  }

  private transformData(text: string): any {
    console.log(text);
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const items = lines.slice(1).map(line => {
      const [item_id, description, , quantity, sell_price, ext_sell_price, salvage_percentage, salvage_amount] = line.split(/\s+/);
      return {
        item_id,
        description,
        quantity: parseFloat(quantity),
        sell_price: parseFloat(sell_price),
        ext_sell_price: parseFloat(ext_sell_price),
        salvage_percentage: parseFloat(salvage_percentage),
        salvage_amount: parseFloat(salvage_amount)
      };
    });
    return { items };
  }
}
