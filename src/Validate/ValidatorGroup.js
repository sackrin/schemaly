import _ from 'lodash';

export class ValidatorGroup {
  options: Object;

  validators: Array<any>;

  constructor ({ validators, ...options }: { validators: Array<any> }) {
    this.validators = validators;
    this.options = options;
  }

  async validate ({ value, ...options }: { value: any }) {
    // If no validators then return a pass grant
    if (this.validators.length === 0) { return { result: true, messages: [] }; }

    return _.reduce(this.validators, async (result: any, validator: any): Promise<Object> => {
      const builtResult = await result;
      // const validated = await validator.validate({ value });
      console.log('------');
      const blah = await validator.validate({ value: 'BLAH' });
      // console.log(blah);
      console.log('------');
      // return { result: (!validated.result ? false : builtResult.result), messages: [ ...builtResult.messages, ...validated.messages ] };
      return { result: true, messages: [] };
    }, { result: true, messages: [] });
  }
}
