import 'mocha';
import * as _ from 'lodash';
import { SmallSimCard } from 'src/domains/SmallSimCard';
import { MediumSimCard } from 'src/domains/MediumSimCard';
import { LargeSimCard } from 'src/domains/LargeSimCard';
import { DatapackSimCard } from 'src/domains/DatapackSimCard';
import { FreeDatapackRule } from 'src/rules/freebies/FreeDatapackRule';
import { expect, should, use } from 'chai';
// import * as chaiThings from 'chai-things';
import * as sinon from 'sinon';

describe('FreeDatapackRule', () => {
  let priceRule, smallCard, mediumCard, largeCard;
  let items, unitPrice, smallCards, mediumCards, largeCards;
  should();
  // use(chaiThings);

  before(() => {
    unitPrice = 24.90;
    priceRule = new FreeDatapackRule('ult_medium', unitPrice);
    smallCard = new SmallSimCard();
    mediumCard = new MediumSimCard();
    largeCard = new LargeSimCard();
    smallCards = _.times(7, () => smallCard);
    mediumCards = _.times(5, () => mediumCard);
    largeCards = _.times(2, () => largeCard);
    items = [...smallCards, ...mediumCards, ...largeCards];
  });

  it('should contain medium sim cards ', () => {
    // given
    const withMediumSimCards = [...smallCards, ...mediumCards, ...largeCards];
    const withoutMediumSimCards = [...smallCards, ...largeCards];

    // when
    const withMediumSimCardsResult = priceRule.hasValidItems(withMediumSimCards);
    const withoutMediumSimCardsResult = priceRule.hasValidItems(withoutMediumSimCards);

    // then
    withMediumSimCardsResult.should.be.equal(true);
    withoutMediumSimCardsResult.should.be.equal(false);
  });

  xit('should have one free datapack sim card for every two medium sim cards', () => {
    // given
    const itemsWithMoreThanTwoMediumSimCards = [...smallCards, ...mediumCards, ...largeCards];
    const itemsWithMediumSimCards = [...smallCards, mediumCard, ...largeCards];

    // when
    const withFreeDatapackSimCards = priceRule.getFreeDatapacks(itemsWithMoreThanTwoMediumSimCards);
    const withoutFreeDatapackSimCards = priceRule.getFreeDatapacks(itemsWithMediumSimCards);

    // then
    // withFreeDatapackSimCards.should.all.have.instanceof(DatapackSimCard);
    withFreeDatapackSimCards.should.all.have.property('price', 0);
  });
});
