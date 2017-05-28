import { SimCard } from '../cards/SimCard';

export class Discount {
  quantities: number;
  unitPrice: number;
  totalDiscount: number;
  freebies: SimCard[];

  constructor(quantities: number, unitPrice: number, totalDiscount: number, freebies: SimCard[] = []) {
    this.quantities = quantities;
    this.unitPrice = unitPrice;
    this.totalDiscount = totalDiscount;
    this.freebies = freebies
  }
}
