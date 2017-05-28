import * as inquirer from 'inquirer';
import { Prompt } from './Prompt';
import { CmdQuestions } from './CmdQuestions';
import { PromptRedirector } from './PromptRedirector';

export class PromoPrompt implements Prompt {

  createPrompt(redirector: PromptRedirector, simCode ? : string) {
    return inquirer.prompt(CmdQuestions.PROMO).then((promoCodeAnswer) => redirector.promo(promoCodeAnswer, simCode));
  }
}
