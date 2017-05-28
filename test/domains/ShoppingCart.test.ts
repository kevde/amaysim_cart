import 'mocha';
import * as _ from 'lodash';
import * as sinon from 'sinon';
import * as chaiThings from 'chai-things';
import { expect, should, use } from 'chai';
import { ShoppingCart } from 'src/domains/ShoppingCart';
import { SmallSimCard } from 'src/domains/SmallSimCard';
import { MediumSimCard } from 'src/domains/MediumSimCard';
import { LargeSimCard } from 'src/domains/LargeSimCard';
import { DatapackSimCard } from 'src/domains/DatapackSimCard';
import { BasePriceRule } from 'src/rules/base/BasePriceRule';
import { PriceBasedDiscountRule } from 'src/rules/discounts/PriceBasedDiscountRule';

describe('ShoppingCart', () => {
  let shoppingCart;
  let smallCard, mediumCard, largeCard, datapackCard;
  let smallBasePriceRule, mediumBasePriceRule, largeBasePriceRule, datapackBasePriceRule;
  should();
  use(chaiThings);

  beforeEach(() => {
    smallBasePriceRule = new BasePriceRule('ult_small', 24.90);
    mediumBasePriceRule = new BasePriceRule('ult_medium', 29.90);
    largeBasePriceRule = new BasePriceRule('ult_large', 44.90);
    datapackBasePriceRule = new BasePriceRule('1gb', 9.90);
    const priceRules = [smallBasePriceRule, mediumBasePriceRule, largeBasePriceRule, datapackBasePriceRule]

    shoppingCart = new ShoppingCart(priceRules);
    smallCard = new SmallSimCard();
    mediumCard = new MediumSimCard();
    largeCard = new LargeSimCard();
    datapackCard = new DatapackSimCard();
  });

  it('should add items', () => {
    // given

    // when
    const result = shoppingCart.add(smallCard);
    shoppingCart.add(mediumCard);
    shoppingCart.add(mediumCard);

    // then
    shoppingCart.items.should.include(smallCard);
    shoppingCart.items.should.include(mediumCard);
  });

  it('should add unit prices for all sims', () => {
    // given

    // when
    const smallSimPrice = shoppingCart.getUnitPrice('ult_small');
    const mediumSimPrice = shoppingCart.getUnitPrice('ult_medium');
    const largeSimPrice = shoppingCart.getUnitPrice('ult_large');
    const datapackSimPrice = shoppingCart.getUnitPrice('1gb');

    // then
    smallSimPrice.should.be.equal(smallBasePriceRule.unitPrice);
    mediumSimPrice.should.be.equal(mediumBasePriceRule.unitPrice);
    largeSimPrice.should.be.equal(largeBasePriceRule.unitPrice);
    datapackSimPrice.should.be.equal(datapackBasePriceRule.unitPrice);
  });


  it('should register additional price rule', () => {
    // given
    const discountRule = new PriceBasedDiscountRule('ult_small', 49.90, 39.90);

    // when
    shoppingCart.register(discountRule);

    // then
    shoppingCart.rules.should.include(discountRule);
  });

  it('should get the total amount of all the items', () => {
    // given
    const smallCards = _.times(5, () => smallCard);
    const mediumCards = _.times(2, () => mediumCard);
    const largeCards = _.times(3, () => largeCard);
    const datapackCards = _.times(10, () => datapackCard);
    const items = [...smallCards, ...mediumCards, ...largeCards, ...datapackCards];

    // when
    randomize(items, (item) => shoppingCart.add(item));
    const totalAmount = shoppingCart.total;

    // then
    const smallSimPrice = shoppingCart.getUnitPrice('ult_small');
    const mediumSimPrice = shoppingCart.getUnitPrice('ult_medium');
    const largeSimPrice = shoppingCart.getUnitPrice('ult_large');
    const datapackSimPrice = shoppingCart.getUnitPrice('1gb');
    const smallSimTotal = smallCards.length * smallSimPrice;
    const mediumSimTotal = mediumCards.length * mediumSimPrice;
    const largeSimTotal = largeCards.length * largeSimPrice;
    const datapackSimTotal = datapackCards.length * datapackSimPrice;
    totalAmount.should.be.equal(smallSimTotal + mediumSimTotal + largeSimTotal + datapackSimTotal);
  });

  it('should get all items by product code', () => {
    // given
    const smallCards = _.times(5, () => smallCard);
    const mediumCards = _.times(2, () => mediumCard);
    const largeCards = _.times(3, () => largeCard);
    const datapackCards = _.times(10, () => datapackCard);
    const items = [...smallCards, ...mediumCards, ...largeCards, ...datapackCards];

    // when
    randomize(items, (item) => shoppingCart.add(item));
    const smallSimItems = shoppingCart.getItemsByCode('ult_small');
    const mediumSimItems = shoppingCart.getItemsByCode('ult_medium');
    const largeSimItems = shoppingCart.getItemsByCode('ult_large');
    const datapackSimItems = shoppingCart.getItemsByCode('1gb');

    // then
    smallSimItems.should.all.be.instanceof(SmallSimCard);
    mediumSimItems.should.all.be.instanceof(MediumSimCard);
    largeSimItems.should.all.be.instanceof(LargeSimCard);
    datapackSimItems.should.all.be.instanceof(DatapackSimCard);

    smallSimItems.length.should.be.equal(smallCards.length);
    mediumSimItems.length.should.be.equal(mediumCards.length);
    largeSimItems.length.should.be.equal(largeCards.length);
    datapackSimItems.length.should.be.equal(datapackCards.length);
  });

  const randomize = (orderedItems, callback) => {
    const items = _.toArray(orderedItems);
    while (items.length > 0) {

      const nextIndex = _.random(0, items.length - 1);
      callback(items[nextIndex]);
      _.pullAt(items, [nextIndex])
    };
  };
});
