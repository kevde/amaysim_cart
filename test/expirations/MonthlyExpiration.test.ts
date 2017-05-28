import 'mocha';
import { MonthlyExpiration } from 'src/expirations/MonthlyExpiration';
import { should } from 'chai';

describe('MonthlyExpiration', () => {
  let monthlyExpiration

  before(() => {});
  should();

  it('should get the expiration date when monthly expiration is one month and date started was january 31, 2017', () => {
    // given
    const dateStarted = new Date(2017, 0, 31);

    // when
    monthlyExpiration = new MonthlyExpiration(dateStarted, 1);
    const endDate = monthlyExpiration.getExpirationDate();

    // then
    endDate.should.be.deep.equal(new Date(2017, 1, 28));
  });

  it('should get the expiration date when monthly expiration is one month and date started was january 1, 2017', () => {
    // given
    const dateStarted = new Date(2017, 0, 1);

    // when
    monthlyExpiration = new MonthlyExpiration(dateStarted, 1);
    const endDate = monthlyExpiration.getExpirationDate();

    // then
    const afterOneMonth = new Date(2017, 1, 1);
    endDate.should.be.deep.equal(afterOneMonth);
  });

  it('should check if the date is expired or not', () => {
    // given
    const dateStarted = new Date(2017, 0, 1);
    const advanceDate = new Date(2016,11,31);
    const validDate = new Date(2017, 0, 12);
    const expiredDate = new Date(2017, 1,28);

    // when
    monthlyExpiration = new MonthlyExpiration(dateStarted, 1);
    const validDateResult = monthlyExpiration.isDateValid(validDate);
    const advanceDateResult = monthlyExpiration.isDateValid(advanceDate);
    const expiredDateResult = monthlyExpiration.isDateValid(expiredDate);

    // then
    validDateResult.should.be.equal(true);
    advanceDateResult.should.be.equal(false);
    expiredDateResult.should.be.equal(false);
  })
});
