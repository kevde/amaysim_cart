import * as _ from 'lodash';
import * as inquirer from 'inquirer';
import { Prompt } from './Prompt';
import { PromptRedirector } from './PromptRedirector';
import { ShoppingCart } from '../main/ShoppingCart';
import { CmdQuestions } from './CmdQuestions';

export class QuotationPrompt implements Prompt {
  firstName: string;
  shoppingCart: ShoppingCart;

  constructor(firstName: string, shoppingCart: ShoppingCart) {
    this.firstName = firstName;
    this.shoppingCart = shoppingCart;
  }

  createPrompt(redirector: PromptRedirector) {
    return inquirer.prompt(this.createQuotationOptions())
      .then((quotationAnswer) => redirector.exit(quotationAnswer, this.shoppingCart));
  }

  createQuotationOptions() {
    return [{
      type: 'confirm',
      name: 'confirmQuotation',
      message: this.createQuoationMessage()
    }];
  };

  createQuoationMessage() {
    const headerText = `\nHi ${this.firstName}! Below is the items you chose, heres the quotation:`;
    const productsTexts = _.map(this.productGroup, (items, code) => `\t\t${items.length} X ${this.findSimCardName(code)}`);
    const totalText = `Total Amount:\t$${this.shoppingCart.total}`;
    const confirmText = 'Quotations are now displayed. Should we go back to main menu?';
    return [headerText, ...productsTexts, totalText, confirmText].join('\n');
  }

  findSimCardName(code) {
    return _.find(CmdQuestions.SIM_CHOICES, ['value', code]).name;
  }

  get productGroup() {
    return _.groupBy(this.shoppingCart.items, 'code');
  }
}
