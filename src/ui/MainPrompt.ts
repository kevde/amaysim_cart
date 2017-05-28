import * as inquirer from 'inquirer';
import { Prompt } from './Prompt';
import { CmdQuestions } from './CmdQuestions';
import { PromptRedirector } from './PromptRedirector';

export class MainPrompt implements Prompt {

  createPrompt(redirector: PromptRedirector) {
    return inquirer.prompt(CmdQuestions.MAIN).then((mainPageAnswer) => redirector.main(mainPageAnswer));
  }
}
