import { SimCard } from 'src/domains/SimCard';
import { Expiration } from 'src/expirations/Expiration';
import { Discount } from 'src/domains/Discount';

export interface PriceRule {
  expiration: Expiration;
  createDiscount: Function;
  isActivated(items: SimCard[], date: Date, promos ? : string[]): boolean;
}
