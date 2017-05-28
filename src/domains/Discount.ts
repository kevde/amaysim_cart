export class Discount {
  quantities: number;
  unitPrice: number;
  totalDiscount: number;

  constructor(quantities: number, unitPrice: number, totalDiscount: number) {
    this.quantities = quantities;
    this.unitPrice = unitPrice;
    this.totalDiscount = totalDiscount;
  }
}
