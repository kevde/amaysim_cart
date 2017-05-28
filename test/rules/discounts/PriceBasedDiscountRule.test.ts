import 'mocha';
import * as _ from 'lodash';
import { Discount } from 'src/domains/Discount';
import { SmallSimCard } from 'src/domains/SmallSimCard';
import { MediumSimCard } from 'src/domains/MediumSimCard';
import { LargeSimCard } from 'src/domains/LargeSimCard';
import { BasePriceRule } from 'src/rules/base/BasePriceRule';
import { PriceBasedDiscountRule } from 'src/rules/discounts/PriceBasedDiscountRule';
import { should } from 'chai';

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

  it('should get discount per unit', () => {
    // given

    // when
    const discountedUnitPrice = priceRule.discountPerUnit;

    // then
    discountedUnitPrice.should.be.equal(basePriceRule.unitPrice - discountedPrice);
  });

  it('should check if items are more than three', () => {
    // given
    const lessThanThreeItems = [...smallCards, ...mediumCards, ..._.times(2, () => largeCard)];

    // when
    const validItemsResult = priceRule.areMoreThanItemsToActivate(validItems);
    const lessThanThreeItemsResult = priceRule.areMoreThanItemsToActivate(lessThanThreeItems);

    // then
    validItemsResult.should.be.equal(true);
    lessThanThreeItemsResult.should.be.equal(false);
  });

  it('should get total discount price', () => {
    // given

    // when
    const totalDiscountedPrice = priceRule.getTotalDiscountPrice(validItems);

    // then
    const itemsLength = priceRule.baseRule.getValidItems(validItems).length;
    totalDiscountedPrice.should.be.equal(itemsLength * priceRule.discountPerUnit);
  });

  it('should create discount', () => {
    // given

    // when
    const smallCardDiscount = priceRule.createDiscount(validItems);

    // then
    smallCardDiscount.should.be.instanceof(Discount);
    smallCardDiscount.quantities.should.be.equal(basePriceRule.getValidItems(validItems).length);
    smallCardDiscount.unitPrice.should.be.equal(priceRule.discountPerUnit);
    smallCardDiscount.totalDiscount.should.be.equal(priceRule.getTotalDiscountPrice(validItems));
  });
});
