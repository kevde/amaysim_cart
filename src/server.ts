import * as _ from 'lodash';
import * as moment from 'moment';
import * as inquirer from 'inquirer';
import { ShoppingCart } from './main/ShoppingCart';
import { CmdQuestions } from './ui/CmdQuestions';
import { SmallSimCard } from './cards/SmallSimCard';
import { MediumSimCard } from './cards/MediumSimCard';
import { LargeSimCard } from './cards/LargeSimCard';
import { DatapackSimCard } from './cards/DatapackSimCard';
import { MonthlyExpiration } from './expirations/MonthlyExpiration';
import { BasePriceRule } from './rules/base/BasePriceRule';
import { ItemBasedDiscountRule } from './rules/discounts/ItemBasedDiscountRule';
import { PriceBasedDiscountRule } from './rules/discounts/PriceBasedDiscountRule';
import { FreeDatapackRule } from './rules/freebies/FreeDatapackRule';
import { AmaysimPromoRule } from './rules/promos/AmaysimPromoRule';
import { MainPrompt } from './ui/MainPrompt';
import { PromoPrompt } from './ui/PromoPrompt';
import { ExitPrompt } from './ui/ExitPrompt';
import { QuotationPrompt } from './ui/QuotationPrompt';
import { SimCardPrompt } from './ui/SimCardPrompt';
import { PromptRedirector } from './ui/PromptRedirector';

const itemsMap = {
  'ult_small': new SmallSimCard(),
  'ult_medium': new MediumSimCard(),
  'ult_large': new LargeSimCard(),
  '1gb': new DatapackSimCard(),
}

const simChoices = [
  { name: 'Unlimited 1GB', value: 'ult_small' },
  { name: 'Unlimited 2GB', value: 'ult_medium' },
  { name: 'Unlimited 5GB', value: 'ult_large' },
  { name: '1GB Datapack', value: '1gb' },
  { name: 'Exit', value: 'exit' },
];

const smallBasePriceRule = new BasePriceRule('ult_small', 24.90);
const mediumBasePriceRule = new BasePriceRule('ult_medium', 29.90);
const largeBasePriceRule = new BasePriceRule('ult_large', 44.90);
const datapackBasePriceRule = new BasePriceRule('1gb', 9.90);
const baseRules = [smallBasePriceRule, mediumBasePriceRule, largeBasePriceRule, datapackBasePriceRule];

const mainPrompt = new MainPrompt();
const promoPrompt = new PromoPrompt();
const exitPrompt = new ExitPrompt();

inquirer.prompt(CmdQuestions.INITIAL).then((answers) => {
  const startDate = moment(answers.promoDate).toDate();
  const promoPeriod = parseInt(answers.promoPeriod);
  const monthlyExpiration = new MonthlyExpiration(startDate, promoPeriod);
  const rulesMap = {
    'APC': new AmaysimPromoRule(10, 'I<3AMAYSIM'),
    '3F2': new ItemBasedDiscountRule(smallBasePriceRule, 3, 1, monthlyExpiration),
    '1GB': new FreeDatapackRule(mediumBasePriceRule, 2),
    'PDR': new PriceBasedDiscountRule(largeBasePriceRule, 3, 39.90, monthlyExpiration)
  }
  const discountPriceRules = _.map(answers.enabledPromos, (code) => rulesMap[code]);
  const priceRules = [...baseRules, ...discountPriceRules];
  const firstName = answers.firstName;
  const enabledPromos = answers.enabledPromos;
  const shoppingCart = new ShoppingCart(priceRules);

  const quotationPrompt = new QuotationPrompt(firstName, shoppingCart);
  const simCardPrompt = new SimCardPrompt(firstName, shoppingCart, itemsMap);
  const promptRedirector = new PromptRedirector(mainPrompt, promoPrompt, exitPrompt, quotationPrompt, simCardPrompt, enabledPromos);

  return mainPrompt.createPrompt(promptRedirector);
});
