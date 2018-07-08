import _ from 'lodash';
import { Isotope } from "../Isotope/Isotope";
import { ValidatorInterface } from "./ValidatorInterface";
import {ValidatorResultInterface} from "./ValidatorResultInterface";

export interface ValidatorsInterface {
  validators: Array<ValidatorInterface>;
  options: Object;
  merge(additional: Array<ValidatorInterface>): void;
  validate({ isotope, ...options }: { isotope: Isotope, options?: Object }): Promise<ValidatorResultInterface>;
}

export class Validators implements ValidatorsInterface {
  validators: Array<ValidatorInterface> = [];

  options: Object = {};

  constructor ({ validators, options = {} }: { validators: Array<ValidatorInterface>, options?:Object }) {
    this.validators = validators;
    this.options = options;
  }

  merge = (additional: Array<ValidatorInterface>): void => {
    if (!_.isArray(additional)) return;
    this.validators = [
      ...additional,
      ...this.validators
    ];
  };

  validate = async ({ isotope, ...options }: { isotope: Isotope, options?: Object }): Promise<ValidatorResultInterface> => {
    if (this.validators.length === 0) return { valid: true, messages: [], children: [] };
    const result:ValidatorResultInterface = {
      valid: true,
      messages: [],
      children: []
    };
    return this.validators.reduce(async (flag: Promise<ValidatorResultInterface>, validator: ValidatorInterface) => {
      const currFlag:ValidatorResultInterface = await flag;
      const validationCheck:ValidatorResultInterface = await validator.validate({ isotope, ...options });
      return {
        valid: !validationCheck.valid ? false : currFlag.valid,
        messages: [ ...currFlag.messages, ...validationCheck.messages ],
        children: [ ...currFlag.children, ...validationCheck.children ]
      };
    }, Promise.resolve(result));
  };
}

export default (
    validators: Array<ValidatorInterface>,
    options: Object = {}
  ): ValidatorsInterface => (new Validators({ validators, options }));
