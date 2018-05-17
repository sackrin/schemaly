import _ from 'lodash';
import { Nucleus } from '../Nucleus';
import { Reactor } from '../Reactor';
import type { ValidationResult } from '../Validate/SimpleValidator';

export class Isotope {
  reactor: Reactor;

  nucleus: Nucleus;

  value: any;

  setters: Array<Function>;

  getters: Array<Function>;

  options: Object;

  constructor ({ reactor, nucleus, value, setters, getters, ...options }: { reactor: Reactor, nucleus: Nucleus, value: any, setters?: Array<Function>, getters?: Array<Function> }) {
    this.reactor = reactor;
    this.nucleus = nucleus;
    this.value = value;
    this.options = options;
    if (getters) this.getters = getters;
    if (setters) this.setters = setters;
    (this:any).getValue = this.getValue.bind(this);
    (this:any).setValue = this.setValue.bind(this);
  }

  async getValue ({ ...options }: Object = {}) {
    // Return the built value
    return _.reduce(this.getters, async (value, getter) => (getter({ isotope: this, value, options: { ...this.options, ...options } })), this.value);
  }

  async setValue ({ value, ...options }: { value: any }) {
    // Assign the built value
    this.value = await _.reduce(this.setters, async (value, setter) => (setter({ isotope: this, value, options: { ...this.options, ...options } })), value);
    // Return the built value
    return this.value;
  }

  async validate ({ ...options }: Object = {}): Promise<ValidationResult> {
    return this.nucleus.validate(this.value);
  }
}
