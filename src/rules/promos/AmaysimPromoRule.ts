import * as _ from 'lodash';
import { Discount } from 'src/domains/Discount';
import { PriceRule } from 'src/rules/PriceRule';
import { Expiration } from 'src/expirations/Expiration';
import { SimCard } from 'src/domains/SimCard';

export class AmaysimPromoRule implements PriceRule {
  expiration: Expiration;
  percentDiscount: number;
  promoCode: string;

  constructor(percentDiscount: number, promoCode: string, expiration ? : Expiration) {
    this.expiration = expiration;
    this.percentDiscount = percentDiscount;
    this.promoCode = promoCode;
  }

  isActivated(items: SimCard[], date: Date = new Date(), promos: string[]) {
    const expirationValid = (this.expiration) ? this.expiration.isDateValid(date) : true;
    return expirationValid && this.isPromoInList(promos);
  }

  createDiscount(totalPrice: number) {
    const discountPrice = this.getDiscountPrice(totalPrice);
    return new Discount(1, discountPrice, discountPrice);
  }

  private getDiscountPrice(totalPrice: number) {
    return (this.percentDiscount / 100) * totalPrice;
  }

  private isPromoInList(promoCodes: string[]) {
    return _.includes(promoCodes, this.promoCode);
  }
}
