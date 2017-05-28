import { Expiration } from 'src/expirations/Expiration';

export interface PriceRule {
  productCode: string;
  unitPrice: number;
  expiration: Expiration;
}
