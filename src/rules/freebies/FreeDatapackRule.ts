import * as _ from 'lodash';
import { PriceRule } from 'src/rules/PriceRule';
import { SimCard } from 'src/domains/SimCard';
import { DatapackSimCard } from 'src/domains/DatapackSimCard';
import { Expiration } from 'src/expirations/Expiration';

export class FreeDatapackRule  {
  productCode: string;
  unitPrice: number;
  expiration: Expiration;

  constructor(productCode: string, unitPrice: number) {
    this.productCode = productCode;
    this.unitPrice = unitPrice;
    this.expiration = null;
  }

  countValidItems(items: SimCard[]) {
    return this.getValidItems(items).length;
  }

  getValidItems(items: SimCard[]) {
    return _.filter(items, (item) => item.code === this.productCode);
  }

  hasValidItems(items: SimCard[]) {
    const validItems = this.getValidItems(items);
    return validItems.length > 1;
  }

  getFreeDatapacks(items: SimCard[]) {
    const datapacksCount = _.floor(this.getValidItems(items).length / 2);
    return _.times(datapacksCount, () => new DatapackSimCard());
  }
}
