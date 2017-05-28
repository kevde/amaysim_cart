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
import { ItemBasedDiscountRule } from 'src/rules/discounts/ItemBasedDiscountRule';

describe('ShoppingCart', () => {
  let shoppingCart, items;
  let smallCard, mediumCard, largeCard, datapackCard;
  let smallCards, mediumCards, largeCards, datapackCards;
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

    smallCards = _.times(5, () => smallCard);
    mediumCards = _.times(2, () => mediumCard);
    largeCards = _.times(3, () => largeCard);
    datapackCards = _.times(10, () => datapackCard);
    items = [...smallCards, ...mediumCards, ...largeCards, ...datapackCards];
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
    const discountRule = new PriceBasedDiscountRule(largeBasePriceRule, 39.90);

    // when
    shoppingCart.register(discountRule);

    // then
    shoppingCart.rules.should.include(discountRule);
  });

  it('should get the total amount of all the items', () => {
    // given

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

  it('should have total of 94.7 dollars when there are 3 small cards and 1 large card with price rule', () => {
    // given
    const smallCards = _.times(3, () => smallCard);
    const largeCards = _.times(1, () => largeCard);
    const items = [...smallCards, ...largeCards];
    const threeForTwoDiscountRule = new ItemBasedDiscountRule(smallBasePriceRule, 3, 1);

    // when 
    shoppingCart.register(threeForTwoDiscountRule);
    randomize(items, (item) => shoppingCart.add(item));

    // then
    const discount = threeForTwoDiscountRule.getDiscount(items);
    shoppingCart.total.should.be.equal(94.70);
  });

  it('should have total of 209.4 dollars when there are 2 small cards and 5 large cards with price rule', () => {
    // given
    const smallCards = _.times(3, () => smallCard);
    const largeCards = _.times(1, () => largeCard);
    const items = [...smallCards, ...largeCards];
    const threeForTwoDiscountRule = new ItemBasedDiscountRule(smallBasePriceRule, 3, 1);
    const priceDropDiscountRule = new PriceBasedDiscountRule(largeBasePriceRule, 39.90);

    // when 
    shoppingCart.register(threeForTwoDiscountRule);
    randomize(items, (item) => shoppingCart.add(item));

    // then
    const discount = threeForTwoDiscountRule.getDiscount(items);
    shoppingCart.total.should.be.equal(94.70);
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
