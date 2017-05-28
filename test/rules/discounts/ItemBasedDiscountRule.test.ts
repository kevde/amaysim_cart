import 'mocha';
import * as _ from 'lodash';
import { SmallSimCard } from 'src/domains/SmallSimCard';
import { MediumSimCard } from 'src/domains/MediumSimCard';
import { LargeSimCard } from 'src/domains/LargeSimCard';
import { Discount } from 'src/domains/Discount';
import { BasePriceRule } from 'src/rules/base/BasePriceRule';
import { ItemBasedDiscountRule } from 'src/rules/discounts/ItemBasedDiscountRule';
import { MonthlyExpiration } from 'src/expirations/MonthlyExpiration';
import { should } from 'chai';

describe('ItemBasedDiscountRule', () => {
  let priceRule, smallCard, mediumCard, largeCard;
  let items, validItems;
  let basePriceRule, smallCards, mediumCards, largeCards;
  should();

  before(() => {
    basePriceRule = new BasePriceRule('ult_small', 24.90);
    smallCard = new SmallSimCard();
    mediumCard = new MediumSimCard();
    largeCard = new LargeSimCard();
    smallCards = _.times(7, () => smallCard);
    mediumCards = _.times(5, () => mediumCard);
    largeCards = _.times(2, () => largeCard);
    items = [...smallCards, ...mediumCards, ...largeCards];
    validItems = [..._.times(7, () => smallCard), ...mediumCards, ...largeCards];
  });

  it('should count all groups of 3', () => {
    // given
    const withoutGroupsOfThree = [..._.times(2, () => smallCard), ...mediumCards, ...largeCards];

    // when
    priceRule = new ItemBasedDiscountRule(basePriceRule, 3, 1);
    const validItemsResult = priceRule.countGroups(validItems);
    const withoutGroupsOfThreeResult = priceRule.countGroups(withoutGroupsOfThree);

    // then
    validItemsResult.should.be.equal(2);
    withoutGroupsOfThreeResult.should.be.equal(0);
  });

  it('should check if rule is activated when expiration is one month', () => {
    // given
    const oneMonthExpiration = new MonthlyExpiration(new Date(2017, 0, 1), 1);

    // when
    priceRule = new ItemBasedDiscountRule(basePriceRule, 3, 1, oneMonthExpiration);
    const activatedResult = priceRule.isActivated(validItems, new Date(2017, 0, 2));
    const inactivatedResult = priceRule.isActivated(validItems, new Date(2017, 1, 28));

    // then
    activatedResult.should.be.equal(true);
    inactivatedResult.should.be.equal(false);
  });

  it('should check if rule is activated when number of valid items are passed', () => {
    // given
    const validItems = [..._.times(7, () => smallCard), ...mediumCards, ...largeCards];
    const invalidItems = [..._.times(2, () => smallCard), ...mediumCards, ...largeCards];

    // when
    priceRule = new ItemBasedDiscountRule(basePriceRule, 3, 1);
    const validItemsResult = priceRule.isActivated(validItems);
    const invalidItemsResult = priceRule.isActivated(invalidItems);

    // then
    validItemsResult.should.be.equal(true);
    invalidItemsResult.should.be.equal(false);
  });

  it('should create discount', () => {
    // given

    // when
    priceRule = new ItemBasedDiscountRule(basePriceRule, 3, 1);
    const smallCardDiscount = priceRule.createDiscount(items);

    // then
    smallCardDiscount.should.be.instanceof(Discount);
    smallCardDiscount.quantities.should.be.equal(priceRule.countGroups(items))
    smallCardDiscount.unitPrice.should.be.equal(basePriceRule.unitPrice)
    smallCardDiscount.totalDiscount.should.be.equal(basePriceRule.unitPrice * priceRule.countGroups(items));
  });
});
