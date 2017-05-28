import * as _ from 'lodash';
import { SimCard } from './SimCard';
import { Discount } from './Discount';
import { PriceRule } from 'src/rules/PriceRule';
import { BasePriceRule } from 'src/rules/base/BasePriceRule';
import { AmaysimPromoRule } from 'src/rules/promos/AmaysimPromoRule';

export class ShoppingCart {
  items: SimCard[];
  rules: PriceRule[];
  private _promoCodes: Set < string > ;

  constructor(rules: PriceRule[]) {
    this.rules = rules;
    this.items = [];
    this._promoCodes = new Set();
  }

  get promoCodes() {
    return Array.from(this._promoCodes);
  }
  add(simCard: SimCard, promoCode ? : string) {
    this.items.push(simCard);
    this._promoCodes.add(promoCode);
  }

  register(priceRule: PriceRule) {
    this.rules.push(priceRule);
  }

  get total() {
    const actualPrice = this.getTotalAmount();
    const otherDiscounts = this.getOtherDiscounts();
    const promoDiscounts = this.getPromoDiscounts(actualPrice, otherDiscounts);
    const discountPrice = this.getTotalDiscountAmount([...promoDiscounts, ...otherDiscounts]);
    return _.round(actualPrice - discountPrice, 2);
  }

  private getTotalAmount() {
    return _.sumBy(this.baseRules, (baseRule) => baseRule.getTotalAmount(this.items));
  }

  private getPromoDiscounts(actualPrice: number, discounts: Discount[]) {
    const totalDiscountAmount = this.getTotalDiscountAmount(discounts);
    return _.map(this.getActivatedRules(this.promoRules), (rule) => rule.createDiscount(actualPrice - totalDiscountAmount));
  }

  private getTotalDiscountAmount(discounts: Discount[]) {
    return _.sumBy(discounts, (discount) => discount.totalDiscount);
  }

  private getActivatedRules(rules) {
    return _.filter(rules, (rule) => rule.isActivated(this.items, new Date(), this.promoCodes));
  }

  private getOtherDiscounts() {
    return _.map(this.getActivatedRules(this.otherRules), (rule) => rule.createDiscount(this.items));
  }

  private get baseRules() {
    return _.filter(this.rules, (rule) => rule instanceof BasePriceRule);
  }

  private get promoRules() {
    return _.filter(this.rules, (rule) => rule instanceof AmaysimPromoRule);
  }

  private get otherRules() {
    return _.reject(this.rules, (rule) => rule instanceof BasePriceRule || rule instanceof AmaysimPromoRule);
  }
}
