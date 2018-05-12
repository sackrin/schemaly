import _ from 'lodash';
import type { ValidationResult } from './SimpleValidator';

export class ValidatorGroup {
  options: Object;

  validators: Array<any>;

  constructor ({ validators, ...options }: { validators: Array<any> }) {
    this.validators = validators;
    this.options = options;
  }

  async validate ({ value, ...options }: { value: any }) : Promise<ValidationResult> {
    // If no validators then return a pass grant
    if (this.validators.length === 0) { return { result: true, messages: [] }; }
    // Loop through and ensure all validators pass for given value
    return _.reduce(this.validators, async (flag: any, validator: any) => {
      const currFlag: Promise<Object> = await flag;
      const validationCheck = await validator.validate({ value, ...options });
      return { result: !validationCheck.result ? false : currFlag.result, messages: [ ...currFlag.messages, ...validationCheck.messages ] };
    }, { result: true, messages: [] });
  }
}
