import { Nucleus } from '../Nucleus';
import { Reactor } from '../Reactor';
import type { ValidationResult } from '../Validate/SimpleValidator';
import { Isotopes } from './index';

export type IsotopeArgs = {
  reactor: Reactor,
  nucleus: Nucleus,
  value: any,
  isotopes?: Isotopes,
  setters?: Array<Function>,
  getters?: Array<Function>
};

export class Isotope {
  reactor: Reactor;

  nucleus: Nucleus;

  value: any;

  isotopes: Isotopes | Array<Isotopes>;

  options: Object;

  get machine () { return this.nucleus.machine; }

  get type () { return this.nucleus.type; }

  get label () { return this.nucleus.label; }

  constructor ({ reactor, nucleus, value, isotopes, ...options }: IsotopeArgs) {
    this.reactor = reactor;
    this.nucleus = nucleus;
    this.value = value;
    if (isotopes) this.isotopes = isotopes;
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
    return validate({ value, isotope: this, ...options });
  };

  sanitize = async ({ ...options }: Object = {}) => {
    const { value, nucleus: { sanitize } } = this;
    this.value = await sanitize({ value, isotope: this, ...options });
    return this.value;
  }
}

export default (args: IsotopeArgs): Isotope => (new Isotope(args));
