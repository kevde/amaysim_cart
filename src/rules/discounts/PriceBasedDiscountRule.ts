import { SimCard } from 'src/domains/SimCard';
import { Discount } from 'src/domains/Discount';
import { DiscountRule } from './DiscountRule';
import { BasePriceRule } from 'src/rules/base/BasePriceRule';
import { Expiration } from 'src/expirations/Expiration';

export class PriceBasedDiscountRule implements DiscountRule {
  baseRule: BasePriceRule;
  discountPrice: number;
  itemsToActivate: number;
  expiration: Expiration;

  constructor(baseRule: BasePriceRule, itemsToActivate: number, discountPrice: number, expiration: Expiration = null) {
    this.baseRule = baseRule;
    this.itemsToActivate = itemsToActivate;
    this.discountPrice = discountPrice;
    this.expiration = expiration;
  }

  isActivated(items: SimCard[], date: Date = new Date()) {
    const expirationValid = (this.expiration) ? this.expiration.isDateValid(date) : true;
    return expirationValid && this.areMoreThanItemsToActivate(items);
  }

  createDiscount(items: SimCard[]) {
    const itemsLength = this.baseRule.getValidItems(items).length;
    return new Discount(itemsLength, this.discountPerUnit, this.getTotalDiscountPrice(items));
  }

  get discountPerUnit() {
    return this.baseRule.unitPrice - this.discountPrice;
  }

  private areMoreThanItemsToActivate(items: SimCard[]) {
    return this.baseRule.getValidItems(items).length > this.itemsToActivate;
  }

  private getTotalDiscountPrice(items: SimCard[]) {
    const itemsLength = this.baseRule.getValidItems(items).length;
    return itemsLength * this.discountPerUnit;
  }
}
