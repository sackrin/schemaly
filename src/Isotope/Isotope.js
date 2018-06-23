import _ from 'lodash';
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

  setters: Array<Function>;

  getters: Array<Function>;

  options: Object;

  constructor ({ reactor, nucleus, value, setters, getters, ...options }: IsotopeArgs) {
    this.reactor = reactor;
    this.nucleus = nucleus;
    this.value = value;
    this.options = options;
    if (getters) this.getters = getters;
    if (setters) this.setters = setters;
  }

  getValue = async ({ ...options }: Object = {}) => {
    // Return the built value
    return _.reduce(this.getters, async (value, getter) => (getter({ isotope: this, value, options: { ...this.options, ...options } })), this.value);
  }

  setValue = async ({ value, ...options }: { value: any }) => {
    // Assign the built value
    this.value = await _.reduce(this.setters, async (value, setter) => (setter({ isotope: this, value, options: { ...this.options, ...options } })), value);
    // Return the built value
    return this.value;
  }

  validate = async ({ ...options }: Object = {}): Promise<ValidationResult> => {
    return this.nucleus.validate({ value: this.value, ...options });
  }
}

export default (args: IsotopeArgs): Isotope => (new Isotope(args));
