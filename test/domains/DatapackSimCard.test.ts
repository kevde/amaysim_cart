import 'mocha';
import { DatapackSimCard } from '../../src/cards/DatapackSimCard';
import { expect, should } from 'chai';
import * as sinon from 'sinon';

describe('DatapackSimCard', () => {
  let simCard;
  should();

  before(() => {
    simCard = new DatapackSimCard();
  });


  it('should have product code 1gb', () => {
    // given

    // when

    // then
    simCard.should.have.property('code', '1gb');
    simCard.should.have.property('name', '1 GB Data-pack');
  });
});
