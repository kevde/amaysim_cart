import * as _ from 'lodash';
import { SimCard } from 'src/domains/SimCard';
import { Discount } from 'src/domains/Discount';
import { PriceRule } from 'src/rules/PriceRule';
import { DiscountRule } from './DiscountRule';
import { BasePriceRule } from 'src/rules/base/BasePriceRule';
import { Expiration } from 'src/expirations/Expiration';

export class ItemBasedDiscountRule extends DiscountRule implements PriceRule {
  productCode: string;
  unitPrice: number;
  itemsPerGroup: number;
  itemsDiscounted: number;
  expiration: Expiration;

  constructor(baseRule: BasePriceRule, itemsPerGroup: number, itemsDiscounted: number, expiration: Expiration = null) {
    super(baseRule.productCode, baseRule.unitPrice, expiration);
    this.itemsPerGroup = itemsPerGroup;
    this.itemsDiscounted = itemsDiscounted;
  }

  isActivated(items: SimCard[], date: Date = new Date()) {
    const expirationValid = (this.expiration) ? this.expiration.isDateValid(date) : true;
    const countedGroups = this.countGroups(items);
    return expirationValid && countedGroups >= 1;
  }

  getDiscount(items: SimCard[]) {
    return new Discount(this.countGroups(items), this.discountUnitPrice, this.getDiscountPrice(items));
  }

  get discountUnitPrice() {
    return this.unitPrice * this.itemsDiscounted;
  }

  private getDiscountPrice(items: SimCard[]) {
    return this.discountUnitPrice * this.countGroups(items);
  }

  private countGroups(items: SimCard[]) {
    const itemsLength = this.getValidItems(items).length;
    return _.floor(itemsLength / this.itemsPerGroup);
  }
}
