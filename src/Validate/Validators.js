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
    if (this.validators.length === 0) { return { result: true, messages: [] }; }
    // Loop through and ensure all validators pass for given value
    return _.reduce(this.validators, async (flag: any, validator: any) => {
      const currFlag: any = await flag;
      const validationCheck = await validator.validate({ value, ...options });
      return { result: !validationCheck.result ? false : currFlag.result, messages: [ ...currFlag.messages, ...validationCheck.messages ] };
    }, { result: true, messages: [] });
  };
}

export default (args: ValidatorsArgs): Validators => (new Validators(args));
