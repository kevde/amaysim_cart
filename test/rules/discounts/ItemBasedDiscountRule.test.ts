import 'mocha';
import * as _ from 'lodash';
import { SmallSimCard } from 'src/domains/SmallSimCard';
import { MediumSimCard } from 'src/domains/MediumSimCard';
import { LargeSimCard } from 'src/domains/LargeSimCard';
import { ItemBasedDiscountRule } from 'src/rules/discounts/ItemBasedDiscountRule';
import { expect, should } from 'chai';
import * as sinon from 'sinon';

describe('ItemBasedDiscountRule', () => {
  let priceRule, smallCard, mediumCard, largeCard;
  let items, unitPrice, smallCards, mediumCards, largeCards;
  should();

  before(() => {
    unitPrice = 24.90;
    priceRule = new ItemBasedDiscountRule('ult_small', unitPrice);
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
    smallCardCount.should.be.equal(7);
  });

  it('should count all groups of 3', () => {
    // given
    const withGroupsOfThree = [..._.times(7, () => smallCard), ...mediumCards, ...largeCards];
    const withoutGroupsOfThree = [..._.times(2, () => smallCard), ...mediumCards, ...largeCards];

    // when
    const withGroupsOfThreeResult = priceRule.countGroupsofThree(withGroupsOfThree);
    const withoutGroupsOfThreeResult = priceRule.countGroupsofThree(withoutGroupsOfThree);

    // then
    withGroupsOfThreeResult.should.be.equal(2);
    withoutGroupsOfThreeResult.should.be.equal(0);
  });

  it('should get discount price', () => {
    // given

    // when
    const smallCardDiscount = priceRule.getDiscountPrice(items);

    // then
    smallCardDiscount.should.be.equal(unitPrice * priceRule.countGroupsofThree(items));
  });
});
