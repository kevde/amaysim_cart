import * as inquirer from 'inquirer';
import { Prompt } from './Prompt';
import { CmdQuestions } from './CmdQuestions';
import { PromptRedirector } from './PromptRedirector';

export class ExitPrompt implements Prompt {

  createPrompt(redirector: PromptRedirector) {
    return inquirer.prompt(CmdQuestions.EXIT)
      .then((exitAnswer) => redirector.terminate());
  }
}
