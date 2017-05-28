import 'mocha';
import * as _ from 'lodash';
import { SmallSimCard } from 'src/domains/SmallSimCard';
import { MediumSimCard } from 'src/domains/MediumSimCard';
import { LargeSimCard } from 'src/domains/LargeSimCard';
import { BasePriceRule } from 'src/rules/base/BasePriceRule';
import { PriceBasedDiscountRule } from 'src/rules/discounts/PriceBasedDiscountRule';
import { expect, should } from 'chai';
import * as sinon from 'sinon';

describe('PriceBasedDiscountRule', () => {
  let priceRule, smallCard, mediumCard, largeCard, discountedPrice;
  let items, validItems;
  let basePriceRule, smallCards, mediumCards, largeCards;
  should();

  before(() => {
    discountedPrice = 39.90;
    basePriceRule = new BasePriceRule('ult_large', 44.90);
    priceRule = new PriceBasedDiscountRule(basePriceRule, 3, discountedPrice);
    smallCard = new SmallSimCard();
    mediumCard = new MediumSimCard();
    largeCard = new LargeSimCard();
    smallCards = _.times(7, () => smallCard);
    mediumCards = _.times(5, () => mediumCard);
    largeCards = _.times(2, () => largeCard);
    items = [...smallCards, ...mediumCards, ...largeCards];
    validItems = [...smallCards, ...mediumCards, ..._.times(7, () => largeCard)];
  });

  it('should check if items are more than three', () => {
    // given
    const validItems = [...smallCards, ...mediumCards, ..._.times(7, () => largeCard)];
    const lessThanThreeItems = [...smallCards, ...mediumCards, ..._.times(2, () => largeCard)];

    // when
    const validItemsResult = priceRule.areMoreThanItemsToActivate(validItems);
    const lessThanThreeItemsResult = priceRule.areMoreThanItemsToActivate(lessThanThreeItems);

    // then
    validItemsResult.should.be.equal(true);
    lessThanThreeItemsResult.should.be.equal(false);
  });

  it('should get discount per unit', () => {
    // given
    const validItems = [...smallCards, ...mediumCards, ..._.times(7, () => largeCard)];
    const lessThanThreeItems = [...smallCards, ...mediumCards, ..._.times(2, () => largeCard)];

    // when
    const discountedUnitPrice = priceRule.getDiscountPerUnit(validItems);
    const basicUnitPrice = priceRule.getDiscountPerUnit(lessThanThreeItems);

    // then
    discountedUnitPrice.should.be.equal(basePriceRule.unitPrice - discountedPrice);
    basicUnitPrice.should.be.equal(0);
  });

  it('should get total discount price', () => {
    // given

    // when
    const totalDiscountedPrice = priceRule.getTotalDiscountPrice(validItems);

    // then
    const discountedUnitPrice = priceRule.getDiscountPerUnit(validItems);
    const itemsLength = priceRule.baseRule.getValidItems(validItems).length;
    totalDiscountedPrice.should.be.equal(itemsLength * discountedUnitPrice);
  });
});
