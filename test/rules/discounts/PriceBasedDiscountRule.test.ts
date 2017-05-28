import 'mocha';
import * as _ from 'lodash';
import { SmallSimCard } from 'src/domains/SmallSimCard';
import { MediumSimCard } from 'src/domains/MediumSimCard';
import { LargeSimCard } from 'src/domains/LargeSimCard';
import { PriceBasedDiscountRule } from 'src/rules/discounts/PriceBasedDiscountRule';
import { expect, should } from 'chai';
import * as sinon from 'sinon';

describe('PriceBasedDiscountRule', () => {
  let priceRule, smallCard, mediumCard, largeCard;
  let items, unitPrice, smallCards, mediumCards, largeCards;
  should();

  before(() => {
    unitPrice = 44.90;
    priceRule = new PriceBasedDiscountRule('ult_large', unitPrice, 39.90);
    smallCard = new SmallSimCard();
    mediumCard = new MediumSimCard();
    largeCard = new LargeSimCard();
    smallCards = _.times(7, () => smallCard);
    mediumCards = _.times(5, () => mediumCard);
    largeCards = _.times(2, () => largeCard);
    items = [...smallCards, ...mediumCards, ...largeCards];
  });

  it('should count all valid items', () => {
    // given

    // when
    const smallCardCount = priceRule.countValidItems(items);

    // then
    smallCardCount.should.be.equal(2);
  });

  it('should check if items are more than three', () => {
    // given
    const moreThanThreeItems = [...smallCards, ...mediumCards, ..._.times(7, () => largeCard)];
    const lessThanThreeItems = [...smallCards, ...mediumCards, ..._.times(2, () => largeCard)];

    // when
    const moreThanThreeItemsResult = priceRule.areMoreThanThreeItems(moreThanThreeItems);
    const lessThanThreeItemsResult = priceRule.areMoreThanThreeItems(lessThanThreeItems);

    // then
    moreThanThreeItemsResult.should.be.equal(true);
    lessThanThreeItemsResult.should.be.equal(false);
  });

  it('should get discounted unit price ', () => {
    // given
    const moreThanThreeItems = [...smallCards, ...mediumCards, ..._.times(7, () => largeCard)];
    const lessThanThreeItems = [...smallCards, ...mediumCards, ..._.times(2, () => largeCard)];

    // when
    const discountedUnitPrice = priceRule.getDiscountedUnitPrice(moreThanThreeItems);
    const basicUnitPrice = priceRule.getDiscountedUnitPrice(lessThanThreeItems);

    // then
    discountedUnitPrice.should.be.equal(39.90);
    basicUnitPrice.should.be.equal(44.90);
  });
});
