import 'mocha';
import { LargeSimCard } from '../../src/cards/LargeSimCard';
import { expect, should } from 'chai';
import * as sinon from 'sinon';

describe('LargeSimCard', () => {
  let simCard;
  should();

  before(() => {
    simCard = new LargeSimCard();
  });


  it('should have product code ult_large', () => {
    // given

    // when

    // then
    simCard.should.have.property('code', 'ult_large');
    simCard.should.have.property('name', 'Unlimited 5GB');
  });
});
