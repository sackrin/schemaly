import _ from 'lodash';
import { buildRules } from './utils';
import Validator from 'validatorjs';

export type ValidationResult = { result: boolean, messages: Array<string> };

export class SimpleValidator {
  config: { rules: Array<string | Function> };

  options: Object;

  constructor ({ rules = ['required'], options = {} }: { rules: Array<string | Function>, options?: Object }) {
    this.config = { rules };
    this.options = { ...options };
    (this:any).getRules = this.getRules.bind(this);
  }

  async getRules ({ options = {} }: { options?: Object } = {}): Promise<string> {
    return buildRules(this.config.rules, { validator: this.options, ...options })
      .then(builtRules => (builtRules.join('|')));
  }

  async validate ({ value, options = {} }: { value:any, options?: Object }): Promise<ValidationResult> {
    const usingRules: string = await this.getRules({ options: options });
    const usingValue: any = !_.isFunction(value) ? value : await value({ ...this.options, ...options });
    const validation = new Validator({ value: usingValue }, { value: usingRules });
    if (validation.fails()) {
      return { result: false, messages: [...validation.errors.get('value'), ..._.get(this.options, 'error_messages', [])] };
    } else {
      return { result: true, messages: [..._.get(this.options, 'success_messages', [])] };
    }
  }
}
