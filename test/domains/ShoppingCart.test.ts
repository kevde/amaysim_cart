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
import { AmaysimPromoRule } from 'src/rules/promos/AmaysimPromoRule'; 
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

  it('should register additional price rule', () => {
    // given
    const discountRule = new PriceBasedDiscountRule(largeBasePriceRule, 3, 39.90);

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
    const smallSimTotal = smallCards.length * smallBasePriceRule.unitPrice;
    const mediumSimTotal = mediumCards.length * mediumBasePriceRule.unitPrice;
    const largeSimTotal = largeCards.length * largeBasePriceRule.unitPrice;
    const datapackSimTotal = datapackCards.length * datapackBasePriceRule.unitPrice;
    totalAmount.should.be.equal(smallSimTotal + mediumSimTotal + largeSimTotal + datapackSimTotal);
  });

  it('should have total of 94.7 dollars when there are 3 small cards and 1 large card with price rule', () => {
    // given
    const smallCards = _.times(3, () => smallCard);
    const largeCards = _.times(1, () => largeCard);
    const items = [...smallCards, ...largeCards];
    const threeForTwoDiscountRule = new ItemBasedDiscountRule(smallBasePriceRule, 3, 1);
    const priceDropDiscountRule = new PriceBasedDiscountRule(largeBasePriceRule, 3, 39.90);

    // when 
    shoppingCart.register(threeForTwoDiscountRule);
    shoppingCart.register(priceDropDiscountRule);
    randomize(items, (item) => shoppingCart.add(item));

    // then
    shoppingCart.total.should.be.equal(94.70);
  });

  it('should have total of 209.4 dollars when there are 2 small cards and 4 large cards with price rule', () => {
    // given
    const smallCards = _.times(2, () => smallCard);
    const largeCards = _.times(4, () => largeCard);
    const items = [...smallCards, ...largeCards];
    const threeForTwoDiscountRule = new ItemBasedDiscountRule(smallBasePriceRule, 3, 1);
    const priceDropDiscountRule = new PriceBasedDiscountRule(largeBasePriceRule, 3, 39.90);

    // when 
    shoppingCart.register(threeForTwoDiscountRule);
    shoppingCart.register(priceDropDiscountRule);
    randomize(items, (item) => shoppingCart.add(item));

    // then
    shoppingCart.total.should.be.equal(209.40);
  });

  it('should have total of 84.70 dollars when there are 1 small cards and 2 medium cards with price rule', () => {
    // given
    const smallCards = _.times(1, () => smallCard);
    const mediumCards = _.times(2, () => mediumCard);
    const items = [...smallCards, ...mediumCards];
    const threeForTwoDiscountRule = new ItemBasedDiscountRule(smallBasePriceRule, 3, 1);
    const priceDropDiscountRule = new PriceBasedDiscountRule(largeBasePriceRule, 3, 39.90);

    // when 
    shoppingCart.register(threeForTwoDiscountRule);
    shoppingCart.register(priceDropDiscountRule);
    randomize(items, (item) => shoppingCart.add(item));

    // then
    shoppingCart.total.should.be.equal(84.70);
  });

  it('should have total of 31.32 dollars when there are 1 small card and 1 datapack card with price rule', () => {
    // given
    const smallCards = _.times(1, () => smallCard);
    const datapackCards = _.times(1, () => datapackCard);
    const items = [...smallCards, ...datapackCards];
    const threeForTwoDiscountRule = new ItemBasedDiscountRule(smallBasePriceRule, 3, 1);
    const priceDropDiscountRule = new PriceBasedDiscountRule(largeBasePriceRule, 3, 39.90);
    const amaysimPromoRule = new AmaysimPromoRule(10, 'I<3AMAYSIM');

    // when 
    shoppingCart.register(threeForTwoDiscountRule);
    shoppingCart.register(priceDropDiscountRule);
    shoppingCart.register(amaysimPromoRule);
    randomize(items, (item) => shoppingCart.add(item, 'I<3AMAYSIM'));

    // then
    shoppingCart.total.should.be.equal(31.32);
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
