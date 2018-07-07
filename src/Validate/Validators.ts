import _ from 'lodash';
import {Validator} from "./index";

export class Validators {
  validators: Array<Validator> = [];

  options = {};

  constructor ({ validators, ...options }: { validators: Array<Validator>, options?:Object }) {
    this.validators = validators;
    this.options = options;
  }

  merge = (additional: Array<Validator>) => {
    if (!_.isArray(additional)) return;
    this.validators = [
      ...additional,
      ...this.validators
    ];
  };

  validate = async ({ isotope: Isotope, ...options }) => {
    if (this.validators.length === 0) return { valid: true, messages: [], children: [] };
    return this.validators.reduce(async (flag, validator) => {
      const currFlag = await flag;
      const validationCheck = await validator.validate({ isotope, ...options });
      return {
        valid: !validationCheck.valid ? false : currFlag.valid,
        messages: [ ...currFlag.messages, ...validationCheck.messages ],
        children: [ ...currFlag.children, ...validationCheck.children ]
      };
    }, {
      valid: true,
      messages: [],
      children: []
    });
  };
}

export default (validators, options = {}) => (new Validators({ validators, ...options }));
