import { PriceRule } from 'src/rules/PriceRule';
import { SimCard } from 'src/domains/SimCard';
import { Discount } from 'src/domains/Discount';

export interface DiscountRule extends PriceRule {
  createDiscount(items: SimCard[]): Discount;
}
