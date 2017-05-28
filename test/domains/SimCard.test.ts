import 'mocha';
import { SimCard } from 'src/domains/SimCard';
import { should } from 'chai';

describe('SimCard', () => {
  let simCard;
  should();

  before(() => {
    simCard = new SimCard('', '');
  });


  it('should have product code', () => {
    // given

    // when

    // then
    simCard.should.have.property('code');
    simCard.should.have.property('name');
  });
});
