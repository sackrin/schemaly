import { Nucleus } from '../Nucleus';
import { Reactor } from '../Reactor';
import type { ValidationResult } from '../Validate/SimpleValidator';

export type IsotopeArgs = {
  reactor: Reactor,
  nucleus: Nucleus,
  value: any,
  setters?: Array<Function>,
  getters?: Array<Function>
};

export class Isotope {
  reactor: Reactor;

  nucleus: Nucleus;

  value: any;

  options: Object;

  constructor ({ reactor, nucleus, value, ...options }: IsotopeArgs) {
    this.reactor = reactor;
    this.nucleus = nucleus;
    this.value = value;
    this.options = options;
  }

  getValue = async ({ ...options }: Object = {}) => {
    // Retrieve the nucleus getter method
    const { getter } = this.nucleus;
    // Return the built value
    return getter({ value: this.value, isotope: this, ...options });
  };

  setValue = async ({ value, ...options }: { value: any }) => {
    // Retrieve the nucleus getter method
    const { setter } = this.nucleus;
    // Assign the built value
    this.value = await setter({ value, isotope: this, ...options });
    // Return the built value
    return this.value;
  };

  validate = async ({ ...options }: Object = {}): Promise<ValidationResult> => {
    const { value, nucleus: { validate } } = this;
    return validate({ value, ...options });
  };
}

export default (args: IsotopeArgs): Isotope => (new Isotope(args));
