import _ from 'lodash';

export class Validators {
  options;

  validators;

  constructor ({ validators, ...options }) {
    this.validators = validators;
    this.options = options;
  }

  validate = async ({ value, ...options }) => {
    // If no validators then return a pass grant
    if (this.validators.length === 0) { return { valid: true, messages: [], children: [] }; }
    // Loop through and ensure all validators pass for given value
    return _.reduce(this.validators, async (flag, validator) => {
      const currFlag = await flag;
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

export default (validators, options = {}) => (new Validators({ validators, ...options }));
