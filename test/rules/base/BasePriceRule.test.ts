import 'mocha';
import * as _ from 'lodash';
import { SmallSimCard } from 'src/domains/SmallSimCard';
import { MediumSimCard } from 'src/domains/MediumSimCard';
import { LargeSimCard } from 'src/domains/LargeSimCard';
import { DatapackSimCard } from 'src/domains/DatapackSimCard';
import { BasePriceRule } from 'src/rules/base/BasePriceRule';
import { should } from 'chai';

describe('BasePriceRule', () => {
  let smallCard, mediumCard, largeCard, datapackCard;
  let items, smallCards, mediumCards, largeCards, datapackCards;
  let smallBasePriceRule, mediumBasePriceRule, largeBasePriceRule, datapackBasePriceRule;
  should();

  before(() => {
    smallCard = new SmallSimCard();
    mediumCard = new MediumSimCard();
    largeCard = new LargeSimCard();
    datapackCard = new DatapackSimCard();
    smallBasePriceRule = new BasePriceRule('ult_small', 24.90);
    mediumBasePriceRule = new BasePriceRule('ult_medium', 29.90);
    largeBasePriceRule = new BasePriceRule('ult_large', 44.90);
    datapackBasePriceRule = new BasePriceRule('1gb', 9.90);

    smallCards = _.times(7, () => smallCard);
    mediumCards = _.times(5, () => mediumCard);
    largeCards = _.times(2, () => largeCard);
    datapackCards = _.times(1, () => datapackCard);

    items = [...smallCards, ...mediumCards, ...largeCards, ...datapackCards];
  });

  it('should count all valid items', () => {
    // given

    // when
    const smallCardCount = smallBasePriceRule.countValidItems(items);
    const mediumCardCount = mediumBasePriceRule.countValidItems(items);
    const largeCardCount = largeBasePriceRule.countValidItems(items);
    const datapackCardCount = datapackBasePriceRule.countValidItems(items);

    // then
    smallCardCount.should.be.equal(7);
    mediumCardCount.should.be.equal(5);
    largeCardCount.should.be.equal(2);
    datapackCardCount.should.be.equal(1);
  });
});
