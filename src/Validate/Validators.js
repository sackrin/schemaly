import _ from 'lodash';
import type { ValidationResult } from './SimpleValidator';

export type ValidatorsArgs = {
  validators: Array<any>
};

export class Validators {
  options: Object;

  validators: Array<any>;

  constructor ({ validators, ...options }: ValidatorsArgs) {
    this.validators = validators;
    this.options = options;
  }

  validate = async ({ value, ...options }: { value: any }) : Promise<ValidationResult> => {
    // If no validators then return a pass grant
    if (this.validators.length === 0) { return { valid: true, messages: [], children: [] }; }
    // Loop through and ensure all validators pass for given value
    return _.reduce(this.validators, async (flag: any, validator: any) => {
      const currFlag: any = await flag;
      const validationCheck = await validator.validate({ value, ...options });
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

export default (validators: Array<any>, options: Object = {}): Validators => (new Validators({ validators, ...options }));
