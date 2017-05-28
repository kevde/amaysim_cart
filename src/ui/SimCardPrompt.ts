import * as inquirer from 'inquirer';
import { Prompt } from './Prompt';
import { ShoppingCart } from '../main/ShoppingCart';
import { PromptRedirector } from './PromptRedirector';
import { CmdQuestions } from './CmdQuestions';

export class SimCardPrompt {
  firstName: string;
  shoppingCart: ShoppingCart;
  itemsMap: Object;

  constructor(firstName: string, shoppingCart: ShoppingCart, itemsMap: Object) {
    this.firstName = firstName;
    this.shoppingCart = shoppingCart;
    this.itemsMap = itemsMap;
  }

  createPrompt(redirector: PromptRedirector) {
    return inquirer.prompt(this.createSimCardOptions())
      .then((simAnswer) => redirector.simCard(simAnswer));
  }

  addSimCard(simCode: string, promoCode?: string) {
    this.shoppingCart.add(this.itemsMap[simCode], promoCode);
  }

  createSimCardOptions() {
    return [{
      type: 'list',
      name: 'simcards',
      message: `Hi ${this.firstName} pick an item. Currently has ${this.shoppingCart.countItems()}`,
      choices: CmdQuestions.SIM_CHOICES
    }];
  }
}
