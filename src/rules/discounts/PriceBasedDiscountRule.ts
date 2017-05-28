import * as _ from 'lodash';
import { SimCard } from 'src/domains/SimCard';
import { PriceRule } from 'src/rules/PriceRule';
import { DiscountRule } from './DiscountRule';
import { BasePriceRule } from 'src/rules/base/BasePriceRule';
import { Expiration } from 'src/expirations/Expiration';

export class PriceBasedDiscountRule extends DiscountRule implements PriceRule {
  productCode: string;
  unitPrice: number;
  discountPrice: number;
  expiration: Expiration;

  constructor(baseRule: BasePriceRule, discountPrice: number, expiration: Expiration = null) {
    super(baseRule.productCode, baseRule.unitPrice, expiration);
    this.discountPrice = discountPrice;

  }

  areMoreThanThreeItems(items: SimCard[]) {
    const validItems = this.getValidItems(items);
    return _.gt(validItems.length, 3);
  }

  getDiscountedUnitPrice(items: SimCard[]) {
    const isDiscountApplied = this.areMoreThanThreeItems(items);
    return isDiscountApplied ? this.discountPrice : this.unitPrice;
  }
}
