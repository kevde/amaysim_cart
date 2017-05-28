import 'mocha';
import * as _ from 'lodash';
import { Discount } from 'src/domains/Discount';
import { SmallSimCard } from 'src/domains/SmallSimCard';
import { MediumSimCard } from 'src/domains/MediumSimCard';
import { LargeSimCard } from 'src/domains/LargeSimCard';
import { BasePriceRule } from 'src/rules/base/BasePriceRule';
import { AmaysimPromoRule } from 'src/rules/promos/AmaysimPromoRule';
import { expect, should } from 'chai';
import * as sinon from 'sinon';


const PROMO_CODE = 'I<3AMAYSIM';

describe('AmaysimPromoRule', () => {
  let priceRule, smallCard, mediumCard, largeCard;
  let items, validItems;
  let basePriceRule, smallCards, mediumCards, largeCards;
  should();

  before(() => {
    priceRule = new AmaysimPromoRule(10, 'I<3AMAYSIM');
    smallCard = new SmallSimCard();
    mediumCard = new MediumSimCard();
    largeCard = new LargeSimCard();
    smallCards = _.times(7, () => smallCard);
    mediumCards = _.times(5, () => mediumCard);
    largeCards = _.times(2, () => largeCard);
    items = [...smallCards, ...mediumCards, ...largeCards];
  });

  it('should detect if promo code is in list', () => {
    // given
    const promoCodes = ['IAMINVALID', 'INVALID2'];
    const promoCodesWithAmaysim = ['IAMINVALID', 'INVALID2', PROMO_CODE];

    // when
    const firstResult = priceRule.isPromoInList(promoCodes);
    const secondResult = priceRule.isPromoInList(promoCodesWithAmaysim);

    // then
    firstResult.should.be.equal(false);
    secondResult.should.be.equal(true);
  });

  it('should check if it is activated when promo code is existing', () => {
    // given
    const promoCodes = ['IAMINVALID', 'INVALID2'];
    const promoCodesWithAmaysim = ['IAMINVALID', 'INVALID2', PROMO_CODE];

    // when
    const firstResult = priceRule.isActivated([], new Date(), promoCodes);
    const secondResult = priceRule.isActivated([], new Date(), promoCodesWithAmaysim);

    // then
    firstResult.should.be.equal(false);
    secondResult.should.be.equal(true);
  });

  it('should create discount with 10 percent', () => {
    // given
    const totalPrice = 300;

    // when
    const discount = priceRule.createDiscount(totalPrice);

    // then
    discount.should.be.instanceof(Discount);
    discount.totalDiscount.should.be.equal(totalPrice * 0.10);
  });

});
