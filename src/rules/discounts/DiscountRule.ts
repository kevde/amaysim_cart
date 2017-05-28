import { PriceRule } from 'src/rules/PriceRule';
import { SimCard } from '../../cards/SimCard';
import { Discount } from '../../main/Discount';

export interface DiscountRule extends PriceRule {
  createDiscount(items: SimCard[]): Discount;
}
