import * as _ from 'lodash';
import { Prompt } from './Prompt';
import { SimCardPrompt } from './SimCardPrompt';

export class PromptRedirector {
  mainPrompt: Prompt;
  promoPrompt: Prompt;
  exitPrompt: Prompt;
  quotationPrompt: Prompt;
  simCardPrompt: SimCardPrompt;
  enabledPromos: string[];

  constructor(mainPrompt: Prompt, promoPrompt: Prompt, exitPrompt: Prompt, quotationPrompt: Prompt, simCardPrompt: SimCardPrompt, enabledPromos: string[] = []) {
    this.mainPrompt = mainPrompt;
    this.promoPrompt = promoPrompt;
    this.exitPrompt = exitPrompt;
    this.quotationPrompt = quotationPrompt;
    this.simCardPrompt = simCardPrompt;
    this.enabledPromos = enabledPromos;
  }

  exit(quotationAnswer, shoppingCart) {
    if (quotationAnswer.confirmQuotation) {
      shoppingCart.clear();
      return this.mainPrompt.createPrompt(this);
    } else {
      return this.exitPrompt.createPrompt(this);
    }
  }

  simCard(simAnswer) {
    if (simAnswer.simcards === 'exit') {
      return this.mainPrompt.createPrompt(this);
    } else {
      if (_.includes(this.enabledPromos, 'APC')) {
        return this.promoPrompt.createPrompt(this, simAnswer.simcards);
      } else {
        this.simCardPrompt.addSimCard(simAnswer.simcards);
        return this.simCardPrompt.createPrompt(this);
      }
    }
  }

  promo(promoCodeAnswer, simCode) {
    this.simCardPrompt.addSimCard(simCode, promoCodeAnswer.promoCode);
    return this.simCardPrompt.createPrompt(this);
  }

  main(mainPageAnswer) {
    switch (mainPageAnswer.mainPage) {
      case 'add':
        return this.simCardPrompt.createPrompt(this);
      case 'checkout':
        return this.quotationPrompt.createPrompt(this);
      case 'exit':
        return this.exitPrompt.createPrompt(this);
    }
  }

  terminate() {
    return console.log('Thanks for Choosing Amaysim Shopping Cart');
  }

}
