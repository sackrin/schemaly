import _ from 'lodash';
import Validator from 'validatorjs';
import { getMixedResult } from '../Utils';
import { Isotope } from "../Isotope/Isotope";
import { ValidatorInterface } from "./ValidatorInterface";

export class SimpleValidator implements ValidatorInterface {
  rules: Array<string | Function> = [];

  options: Object;

  constructor ({ rules, ...options }: { rules: Array<string | Function> }) {
    this.rules = rules;
    this.options = options;
  }

  getRules = async ({ ...options } = {}) => {
    return getMixedResult(this.rules, { validator: this.options, ...options })
      .then(builtRules => (builtRules.join('|')));
  };

  validate = async ({ isotope, ...options }: { isotope: Isotope, options?: Object }): Promise<{ valid: boolean, messages: Array<string>, children: Array<any>}> => {
    const value = await isotope.getValue();
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

export default (args: { rules: Array<string | Function> }) => (new SimpleValidator(args));
