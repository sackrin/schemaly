import { Nucleus } from '../Nucleus';
import { Reactor } from '../Reactor';
import type { ValidationResult } from '../Validate/SimpleValidator';
import { Isotopes } from './';

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

  children: Array<Isotopes> = [];

  options: Object;

  get machine () { return this.nucleus.machine; }

  get type () { return this.nucleus.type; }

  get label () { return this.nucleus.label; }

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

  find = (criteria: Object) => {
    return this.children.reduce((found, item: Isotopes) => {
      const search = item.find(criteria);
      return !found && search ? search : found;
    }, undefined);
  };

  filter = (criteria: Object) => {
    return this.children.reduce((lst, item: Isotopes) => {
      const filtered = item.filter(criteria);
      return filtered.length > 0 ? [ ...lst, ...filtered ] : lst;
    }, []);
  };

  grant = async () => {
    const { scope, roles } = this.reactor;
    const { grant } = this.nucleus;
    return grant({ isotope: this, scope, roles });
  };

  hydrate = async (options: Object = {}) => {
    const { reactor, nucleus, value } = this;
    const { type, nuclei } = nucleus;
    if ((type.children || type.repeater) && !nuclei) {
      throw new Error('NUCLEUS_EXPECTS_CHILDREN');
    }
    const hydrated = [];
    if (type.children && !type.repeater) {
      hydrated.push(await Isotopes({ reactor, nuclei, values: value }).hydrate(options));
    } else if (type.children && type.repeater) {
      await Promise.all(value.map(async _value => {
        hydrated.push(await Isotopes({ reactor, nuclei, values: _value }).hydrate(options));
      }));
    }
    this.children = hydrated;
    return this;
  };

  sanitize = async () => {
    const { nucleus, type, children, options } = this;
    if (type.children || type.repeater) {
      return Promise.all(children.map(async (isotopes) => (isotopes.sanitize(options))));
    } else {
      this.value = await nucleus.sanitize({ isotope: this, ...options });
    }
  };

  validate = async ({ ...options }: Object = {}): Promise<ValidationResult> => {
    const { value, machine, label, type, nucleus, children } = this;
    const validated = await nucleus.validate({ value, isotope: this, ...options });
    const result = { ...validated, machine, type, label };
    if (type.children) {
      result.children = await Promise.all(children.map(async (isotopes) => (isotopes.validate())));
      result.valid = result.children.reduce((curr, groupResult) => (
        Object.values(groupResult).reduce((isValid, childResult) => (childResult.valid !== true ? false : isValid), curr)
      ), result.valid);
    }
    return result;
  };

  dump = async () => {
    const { type, children } = this;
    if (type.children && !type.repeater) {
      return children.length > 0 ? children[0].dump() : {};
    } else if (type.children && type.repeater) {

    } else {
      return this.getValue();
    }
  };
}

export default (args: IsotopeArgs): Isotope => (new Isotope(args));
