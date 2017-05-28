import * as _ from 'lodash';
import { SimCard } from '../../cards/SimCard';
import { Discount } from '../../main/Discount';
import { DiscountRule } from './DiscountRule';
import { BasePriceRule } from 'src/rules/base/BasePriceRule';
import { Expiration } from 'src/expirations/Expiration';

export class ItemBasedDiscountRule implements DiscountRule {
  baseRule: BasePriceRule;
  itemsPerGroup: number;
  itemsDiscounted: number;
  expiration: Expiration;

  constructor(baseRule: BasePriceRule, itemsPerGroup: number, itemsDiscounted: number, expiration: Expiration = null) {
    this.baseRule = baseRule;
    this.expiration = expiration;
    this.itemsPerGroup = itemsPerGroup;
    this.itemsDiscounted = itemsDiscounted;
  }

  isActivated(items: SimCard[], date: Date = new Date()) {
    const expirationValid = (this.expiration) ? this.expiration.isDateValid(date) : true;
    return expirationValid && this.countGroups(items) >= 1;
  }

  createDiscount(items: SimCard[]) {
    return new Discount(this.countGroups(items), this.discountPerUnit, this.getTotalDiscountPrice(items));
  }

  get discountPerUnit() {
    return this.baseRule.unitPrice * this.itemsDiscounted;
  }

  private getTotalDiscountPrice(items: SimCard[]) {
    return this.discountPerUnit * this.countGroups(items);
  }

  private countGroups(items: SimCard[]) {
    const itemsLength = this.baseRule.getValidItems(items).length;
    return _.floor(itemsLength / this.itemsPerGroup);
  }
}
