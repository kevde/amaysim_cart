import * as _ from 'lodash';
import { SimCard } from './SimCard';
import { PriceRule } from 'src/rules/PriceRule';
import { BasePriceRule } from 'src/rules/base/BasePriceRule';

export class ShoppingCart {
  items: SimCard[];
  rules: PriceRule[];
  baseRules: BasePriceRule[];

  constructor(rules: PriceRule[]) {
    this.rules = this.getOtherPriceRules(rules);
    this.baseRules = this.getBasePriceRules(rules);
    this.items = [];
  }

  add(simCard: SimCard) {
    this.items.push(simCard);
  }

  register(priceRule: PriceRule) {
    if (priceRule instanceof BasePriceRule) {
      this.baseRules.push(priceRule);
    } else {
      this.rules.push(priceRule);
    }
  }

  get total() {
    return _.sum(this.getListOfTotals());
  }

  private getListOfTotals(): number[] {
    return _.map(this.baseRules, (baseRule) => baseRule.unitPrice * this.getItemsByCode(baseRule.productCode).length);
  }

  private getBasePriceRules(rules: PriceRule[]) {
    return _.filter(rules, (rule) => rule instanceof BasePriceRule);
  }

  private getOtherPriceRules(rules: PriceRule[]) {
    return _.reject(rules, (rule) => rule instanceof BasePriceRule);
  }

  private getUnitPriceRule(code: string): BasePriceRule {
    return _.find(this.baseRules, (rule) => rule.productCode === code);
  }

  private getItemsByCode(code: string): SimCard[] {
    return _.filter(this.items, (item) => item.code === code);
  }

  private getUnitPrice(code: string): number {
    const unitPriceRule = this.getUnitPriceRule(code);
    return unitPriceRule.unitPrice || 0;
  }
}
