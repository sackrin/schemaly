import _ from 'lodash';
import { NucleusGroup } from './NucleusGroup';
import type { NucleusContext } from './context';
import { Isotope } from '../Isotope';

export type NucleusArgs = {
  type: NucleusContext,
  machine: string,
  label: string,
  parent?: Object,
  nuclei?: Object,
  setters?: Array<Function>,
  getters?: Array<Function>,
  policies?: Object,
  sanitizers?: Object,
  validators?: Object,
  options?: Object
};

export class Nucleus {
  config: {
    type: NucleusContext,
    machine: string,
    label:string
  };

  parent: Object;

  nuclei: NucleusGroup;

  options: Object;

  policies: Object;

  sanitizers: Object;

  validators: Object;

  setters: Array<Function>;

  getters: Array<Function>;

  constructor ({ type, machine, label, parent, nuclei, getters, setters, policies, sanitizers, validators, ...options }: NucleusArgs) {
    this.config = { type, machine, label };
    if (parent) this.parent = parent;
    if (policies) this.policies = policies;
    if (sanitizers) this.sanitizers = sanitizers;
    if (validators) this.validators = validators;
    if (getters) this.getters = getters;
    if (setters) this.setters = setters;
    if (nuclei) this.addNuclei({ nuclei: nuclei });
    this.options = { ...options };
  }

  get machine () { return this.config.machine; }

  get type () { return this.config.type; }

  get label () { return this.config.label; }

  addNuclei = ({ nuclei }: { nuclei: NucleusGroup}) => {
    if (!this.config.type.children && !this.config.type.repeater) {
      throw new Error('CANNOT_HAVE_CHILDREN');
    }
    nuclei.parent = this;
    this.nuclei = nuclei;
  };

  grant = async ({ isotope, scope, roles, ...options }: { isotope: Isotope, scope: Array<string | Function>, roles: Array<string | Function> }) => {
    const { policies } = this;
    if (!policies) return true;
    return policies.grant({ isotope, scope, roles, ...options });
  };

  validate = async ({ value, isotope, ...options }: { value: any, isotope: Isotope, options?: Object }) => {
    const { validators: { validate } } = this;
    return validate({ value, isotope, ...options });
  };

  sanitize = async ({ value, isotope, ...options }: { value: any, isotope: Isotope, options?: Object }) => {
    const { sanitizers: { filter } } = this;
    return filter({ value, isotope, ...options });
  };

  getter = async ({ value, isotope, ...options }: { value:any, isotope: Isotope, options?: Object } = {}) => {
    // Return the built value
    return _.reduce(this.getters, async (value, getter) => (getter({ isotope, value, options })), value);
  };

  setter = async ({ value, isotope, ...options }: { value: any, isotope: Isotope, options?: Object }) => {
    // Assign the built value
    return _.reduce(this.setters, async (value, setter) => (setter({ isotope, value, options })), value);
  };
}

export default (args: NucleusArgs): Nucleus => (new Nucleus(args));
