import * as _ from 'lodash';
import { PriceRule } from 'src/rules/PriceRule';
import { SimCard } from 'src/domains/SimCard';
import { Expiration } from 'src/expirations/Expiration';

export class BasePriceRule implements PriceRule {
  productCode: string;
  unitPrice: number;
  expiration: Expiration;

  constructor(productCode: string, unitPrice: number) {
    this.productCode = productCode;
    this.unitPrice = unitPrice;
    this.expiration = null;
  }

  isActivated() {
    return true;
  }

  countValidItems(items: SimCard[]) {
    return this.getValidItems(items).length;
  }

  getValidItems(items: SimCard[]) {
    return _.filter(items, (item) => item.code === this.productCode);
  }

  getTotalAmount(items: SimCard[]) {
    return this.unitPrice * this.countValidItems(items);
  }
}
