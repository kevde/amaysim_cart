import { SimCard } from 'src/domains/SimCard';
import { Expiration } from 'src/expirations/Expiration';

export interface PriceRule {
  expiration: Expiration;
  isActivated(items: SimCard[], date: Date): boolean;
}
