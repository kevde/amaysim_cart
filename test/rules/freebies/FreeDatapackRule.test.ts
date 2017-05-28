import 'mocha';
import * as _ from 'lodash';
import * as chaiThings from 'chai-things';
import { should, use } from 'chai';
import { SmallSimCard } from 'src/domains/SmallSimCard';
import { MediumSimCard } from 'src/domains/MediumSimCard';
import { LargeSimCard } from 'src/domains/LargeSimCard';
import { DatapackSimCard } from 'src/domains/DatapackSimCard';
import { BasePriceRule } from 'src/rules/base/BasePriceRule';
import { FreeDatapackRule } from 'src/rules/freebies/FreeDatapackRule';

describe('FreeDatapackRule', () => {
  let priceRule, smallCard, mediumCard, largeCard;
  let items, itemsWithMediumSimCards;
  let mediumBasePriceRule, smallCards, mediumCards, largeCards;
  should();
  use(chaiThings);

  before(() => {
    mediumBasePriceRule = new BasePriceRule('ult_medium', 24.90);
    priceRule = new FreeDatapackRule(mediumBasePriceRule, 2);
    smallCard = new SmallSimCard();
    mediumCard = new MediumSimCard();
    largeCard = new LargeSimCard();
    smallCards = _.times(7, () => smallCard);
    mediumCards = _.times(5, () => mediumCard);
    largeCards = _.times(2, () => largeCard);
    items = [...smallCards, ...mediumCards, ...largeCards];
    itemsWithMediumSimCards = [...smallCards, ...mediumCards, ...largeCards];
  });

  it('should be activated when medium sim card exists', () => {
    // given
    const itemsWithoutMediumSimCards = [...smallCards, ...largeCards];

    // when
    const activatedResult = priceRule.isActivated(itemsWithMediumSimCards);
    const inactivatedResult = priceRule.isActivated(itemsWithoutMediumSimCards);

    // then
    activatedResult.should.be.equal(true);
    inactivatedResult.should.be.equal(false);
  });

  it('should create a discount with free datapacks', () => {
    // given
    
    // when
    const discount = priceRule.createDiscount(itemsWithMediumSimCards);

    // then
    discount.freebies.should.all.have.instanceof(DatapackSimCard);
    discount.freebies.length.should.be.equal(_.floor(mediumCards.length / 2));
  });
});
