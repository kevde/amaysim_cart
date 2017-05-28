import 'mocha';
import { SmallSimCard } from 'src/domains/SmallSimCard';
import { expect, should } from 'chai';
import * as sinon from 'sinon';

describe('SmallSimCard', () => {
  let simCard;
  should();

  before(() => {
    simCard = new SmallSimCard();
  });


  it('should have product code ult_small', () => {
    // given

    // when

    // then
    simCard.should.have.property('code', 'ult_small');
    simCard.should.have.property('name', 'Unlimited 1GB');
  });
});
