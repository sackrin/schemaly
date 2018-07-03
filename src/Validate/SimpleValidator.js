import _ from 'lodash';
import { buildRules } from './utils';
import Validator from 'validatorjs';

export class SimpleValidator {
  rules = [];

  options;

  constructor ({ rules, ...options }) {
    this.rules = rules;
    this.options = options;
  }

  getRules = async ({ ...options } = {}) => {
    return buildRules(this.rules, { validator: this.options, ...options })
      .then(builtRules => (builtRules.join('|')));
  };

  validate = async ({ value, ...options }) => {
    const usingRules = await this.getRules({ options: options });
    const usingValue = !_.isFunction(value) ? value : await value({ ...this.options, ...options });
    const validation = new Validator({ value: usingValue }, { value: usingRules });
    if (validation.fails()) {
      return { valid: false, messages: [...validation.errors.get('value'), ..._.get(this.options, 'error_messages', [])], children: [] };
    } else {
      return { valid: true, messages: [..._.get(this.options, 'success_messages', [])], children: [] };
    }
  };
}

export default (args) => (new SimpleValidator(args));
