import * as _ from 'lodash';
import { SimCard } from 'src/domains/SimCard';
import { PriceRule } from 'src/rules/PriceRule';
import { DiscountRule } from './DiscountRule';

export class ItemBasedDiscountRule extends DiscountRule implements PriceRule {
  productCode: string;
  unitPrice: number;

  getDiscountPrice(items: SimCard[]) {
    return this.unitPrice * this.countGroupsofThree(items);
  }

  private countGroupsofThree(items: SimCard[]) {
    const itemsCount = this.countValidItems(items);
    return _.floor(itemsCount / 3);
  }
}
