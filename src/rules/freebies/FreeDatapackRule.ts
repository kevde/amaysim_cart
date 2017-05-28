import * as _ from 'lodash';
import { SimCard } from '../../cards/SimCard';
import { Discount } from '../../main/Discount';
import { PriceRule } from 'src/rules/PriceRule';
import { BasePriceRule } from 'src/rules/base/BasePriceRule';
import { DatapackSimCard } from '../../cards/DatapackSimCard';
import { Expiration } from 'src/expirations/Expiration';

export class FreeDatapackRule implements PriceRule {
  baseRule: BasePriceRule;
  itemsToActivate: number;
  expiration: Expiration;

  constructor(baseRule: BasePriceRule, itemsToActivate: number, expiration: Expiration = null) {
    this.baseRule = baseRule;
    this.expiration = expiration;
    this.itemsToActivate = itemsToActivate;
  }

  isActivated(items: SimCard[], date: Date = new Date()) {
    const expirationValid = (this.expiration) ? this.expiration.isDateValid(date) : true;
    return expirationValid && this.baseRule.countValidItems(items) >= this.itemsToActivate;
  }

  createDiscount(items: SimCard[]) {
    const freeDataPacks = this.getFreeDatapacks(items);
    return new Discount(freeDataPacks.length, 0, 0, freeDataPacks);
  }

  private getFreeDatapacks(items: SimCard[]) {
    const datapacksCount = _.floor(this.baseRule.countValidItems(items) / 2);
    return _.times(datapacksCount, () => new DatapackSimCard());
  }
}
