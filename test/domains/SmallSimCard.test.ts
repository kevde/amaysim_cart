import 'mocha';
import { SmallSimCard } from 'src/domains/SmallSimCard';
import { should } from 'chai';

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
