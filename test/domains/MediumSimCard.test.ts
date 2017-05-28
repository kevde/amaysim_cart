import 'mocha';
import { MediumSimCard } from 'src/domains/MediumSimCard';
import { expect, should } from 'chai';
import * as sinon from 'sinon';

describe('MediumSimCard', () => {
  let simCard;
  should();

  before(() => {
    simCard = new MediumSimCard();
  });


  it( 'should have product code ult_medium', () => {
    // given

    // when

    // then
    simCard.should.have.property('code', 'ult_medium');
    simCard.should.have.property('name', 'Unlimited 2GB');
  });
});
