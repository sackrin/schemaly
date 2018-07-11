import { Context } from "./Context/Types";
import { Nuclei } from "./Nuclei";
import { Policies } from "../Policy/Types";
import { Sanitizers } from "../Sanitize/Types";
import { ValidatorResult, Validators } from "../Validate/Types";

interface NucleusArgs {
  machine: string;
  type: Context;
  label?: string;
  parent?: Nucleus;
  nuclei?: Nuclei;
  getters?: Function[];
  setters?: Function[];
  policies?: Policies;
  sanitizers?: Sanitizers;
  validators?: Validators;
  options?: any;
}

export class Nucleus {
  public type: Context;

  public machine: string;

  public label?: string;

  public parent?: Nucleus;

  public nuclei?: Nuclei;

  public options?: any = {};

  public policies?: Policies;

  public sanitizers?: Sanitizers;

  public validators?: Validators;

  public setters?: Function[] = [];

  public getters?: Function[] = [];

  constructor ({ type, machine, label, parent, nuclei, getters, setters, policies, sanitizers, validators, options = {} }: NucleusArgs) {
    this.type = type;
    this.machine = machine;
    this.parent = parent;
    this.policies = policies;
    this.getters = getters;
    this.setters = setters;
    this.options = options;
    if (nuclei) {
      this.addNuclei({ nuclei });
    }

    if (validators) {
      validators.merge(type.validators);
      this.validators = validators;
    } else {
      this.validators = Validators([
        ...type ? type.validators : []
      ]);
    }


  }

  addSanitizers = (sanitizers) => {
    if (sanitizers) {
      sanitizers.merge(this.type.sanitizers);
      this.sanitizers = sanitizers;
    } else {
      this.sanitizers = Sanitizers([
        ...type ? type.sanitizers : []
      ]);
    }
  }

  addNuclei = ({ nuclei }): void => {
    if (!this.config.type.children && !this.config.type.repeater) {
      throw new Error('CANNOT_HAVE_CHILDREN');
    }
    nuclei.parent = this;
    this.nuclei = nuclei;
  };

  grant = async ({ isotope, scope, roles, options }): Promise<boolean> => {
    const { policies } = this;
    if (!policies) return true;
    return policies.grant({ isotope, scope, roles, options });
  };

  validate = async ({ value, isotope, options }): Promise<ValidatorResult> => {
    const { validators } = this;
    return validators ? validators.validate({ value, isotope, options }) : { valid: true, messages: [], children: [] };
  };

  sanitize = async ({ isotope, ...options }): Promise<any> => {
    const { sanitizers } = this;
    return sanitizers ? sanitizers.filter({ isotope, ...options }) : isotope.getValue();
  };

  getter = async ({ value, isotope, ...options } = {}): Promise<any> => {
    return this.getters.reduce(async (value, getter) => (getter({ isotope, value, options })), value);
  };

  setter = async ({ value, isotope, ...options }): Promise<any> => {
    return this.setters.reduce(async (value, setter) => (setter({ isotope, value, options })), value);
  };
}

export default (args) => (new Nucleus(args));
