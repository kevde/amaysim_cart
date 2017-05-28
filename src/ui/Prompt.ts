import { PromptRedirector } from './PromptRedirector';
export interface Prompt {
  createPrompt(redirector: PromptRedirector, other ?: any): Promise<any>;
}
