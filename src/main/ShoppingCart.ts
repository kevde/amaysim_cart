import * as _ from 'lodash';
import { SimCard } from '../cards/SimCard';
import { Discount } from './Discount';
import { PriceRule } from 'src/rules/PriceRule';
import { BasePriceRule } from 'src/rules/base/BasePriceRule';
import { AmaysimPromoRule } from 'src/rules/promos/AmaysimPromoRule';

export class ShoppingCart {
  rules: PriceRule[];
  discounts: Discount[];
  private currentDate: Date;
  private _items: SimCard[];
  private _promoCodes: Set < string > ;


  constructor(rules: PriceRule[], currentDate: Date = new Date()) {
    this.rules = rules;
    this.currentDate = currentDate;
    this.discounts = [];
    this._items = [];
    this._promoCodes = new Set();
  }

  get promoCodes() {
    return Array.from(this._promoCodes);
  }

  get total() {
    const discountPrice = this.getTotalDiscountAmount(this.discounts);
    return _.round(this.getActualAmount() - discountPrice, 2);
  }

  setDiscounts(actualAmount: number) {
    const otherDiscounts = this.getOtherDiscounts();
    const promoDiscounts = this.getPromoDiscounts(actualAmount, otherDiscounts);
    this.discounts = [...promoDiscounts, ...otherDiscounts];
  }

  get items() {
    const freebieItems = _.flatten(_.map(this.discounts, (discount) => discount.freebies));
    return [...this._items, ...freebieItems];
  }

  add(simCard: SimCard, promoCode ? : string) {
    this._items.push(simCard);
    this._promoCodes.add(promoCode);
    const actualAmount = this.getActualAmount();
    this.setDiscounts(actualAmount);
  }

  private getActualAmount() {
    return _.sumBy(this.baseRules, (baseRule) => baseRule.getTotalAmount(this._items));
  }

  private getPromoDiscounts(actualAmount: number, discounts: Discount[]) {
    const totalDiscountAmount = this.getTotalDiscountAmount(discounts);
    return _.map(this.getActivatedRules(this.promoRules), (rule) => rule.createDiscount(actualAmount - totalDiscountAmount));
  }

  private getTotalDiscountAmount(discounts: Discount[]) {
    return _.sumBy(discounts, (discount) => discount.totalDiscount);
  }

  private getActivatedRules(rules) {
    return _.filter(rules, (rule) => rule.isActivated(this._items, this.currentDate, this.promoCodes));
  }

  private getOtherDiscounts() {
    return _.map(this.getActivatedRules(this.otherRules), (rule) => rule.createDiscount(this._items));
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
