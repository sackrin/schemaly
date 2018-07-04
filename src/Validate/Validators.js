import _ from 'lodash';

export class Validators {
  validators = [];

  options = {};

  constructor ({ validators, ...options }) {
    this.validators = validators;
    this.options = options;
  }

  merge = (additional) => {
    if (!_.isArray(additional)) return;
    this.validators = [
      ...additional,
      ...this.validators
    ];
  };

  validate = async ({ isotope, ...options }) => {
    // If no validators then return a pass grant
    if (this.validators.length === 0) { return { valid: true, messages: [], children: [] }; }
    // Loop through and ensure all validators pass for given value
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
