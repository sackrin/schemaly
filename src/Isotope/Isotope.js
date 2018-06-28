import _ from 'lodash';
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

// export const validateIsotopes = async (isotopes) => ({});
//
// export const doSingleValidation = async (isotopes) => (isotopes ? isotopes.validate() : undefined);
//
// export const isSingleValid = (validated) => (validated.result);
//
// export const doMultiValidation = async (isotopes) => (Promise.all(_.map(isotopes, async (subgroup) => (subgroup.validate()))));
//
// export const isMultiValid = (validated) => (validated.reduce((curr, child) => (child.result !== true ? false : curr), true));

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
    const { reactor, nucleus } = this;
    const { type, nuclei } = nucleus;
    if ((type.children || type.repeater) && !nuclei) {
      throw new Error('NUCLEUS_EXPECTS_CHILDREN');
    }
    const hydrated = [];
    const value = await this.getValue();
    if (type.children && !type.repeater) {
      hydrated.push(await Isotopes({ reactor, nuclei, values: value }).hydrate(options));
    } else if (type.children && type.repeater) {
      await Promise.all(value.map(async value => {
        hydrated.push(await Isotopes({ reactor, nuclei, values: value }).hydrate(options));
      }));
    }
    this.children = hydrated;
    return this;
  };

  validate = async ({ ...options }: Object = {}): Promise<ValidationResult> => {
    console.log('derp');
    // const { value, nucleus, isotopes, type } = this;
    //
    // if (type.children && type.repeater) {
    //
    // } else if (type.children && type.repeater) {
    //
    // }
    //
    // const validation = await nucleus.validate({ value, isotope: this, ...options });
    // const childValidation = await validateIsotopes(isotopes);
    // return isotopes ? {
    //   ...validation,
    //   result: (validation.result && childValid),
    //   isotopes: _.isArray(isotopes) ? await doMultiValidation(isotopes) : await doSingleValidation(isotopes)
    // } : validation;
  };

  sanitize = async ({ ...options }: Object = {}) => {
    const { value, nucleus: { sanitize } } = this;
    this.value = await sanitize({ value, isotope: this, ...options });
    return this.value;
  }
}

export default (args: IsotopeArgs): Isotope => (new Isotope(args));
