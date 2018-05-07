import _ from 'lodash';
import { buildRules } from './utils';
import Validator from 'validatorjs';

export class SimpleValidator {
  config;

  options;

  constructor ({ rules = ['required'], options = {} }) {
    this.config = { rules };
    this.options = { ...options };
    this.getRules = this.getRules.bind(this);
  }

  async getRules ({ options = {} } = {}) {
    return buildRules(this.config.rules, { validator: this.options, ...options })
      .then(builtRules => (builtRules.join('|')));
  }

  async validate ({ value }) {
    const usingRules = await this.getRules();
    const validation = new Validator({ value: value }, { value: usingRules });

    if (validation.fails()) {
      return { result: false, messages: [...validation.errors.get('value'), ..._.get(this.options, 'error_messages', [])] };
    } else {
      return { result: true, messages: [..._.get(this.options, 'success_messages', [])] };
    }
  }
}
