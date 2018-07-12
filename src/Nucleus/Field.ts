import { Context } from "./Context/Types";
import { Policies } from "../Policy/Types";
import {SanitizerApplyArgs, Sanitizers} from "../Sanitize/Types";
import {
  ValidatorResult,
  Validators,
  ValidatorValidateArgs,
} from "../Validate/Types";
import { SanitizeAll } from "../Sanitize";
import { ValidateAll } from "../Validate";
import { Isotope } from "../Isotope/Isotope";
import { PolicyGrantArgs } from "../Policy";
import { Nucleus, Nuclei, NucleusArgs } from "./Types";

export class Field implements Nucleus {
  public context: Context;

  public machine: string;

  public label?: string;

  public parent?: Nucleus;

  public nuclei?: Nuclei;

  public options?: any = {};

  public policies?: Policies;

  public sanitizers: Sanitizers = SanitizeAll([]);

  public validators: Validators = ValidateAll([]);

  public setters?: Function[] = [];

  public getters?: Function[] = [];

  constructor({
    context,
    machine,
    label,
    parent,
    nuclei,
    getters,
    setters,
    policies,
    sanitizers,
    validators,
    options = {},
  }: NucleusArgs) {
    this.context = context;
    this.machine = machine;
    this.parent = parent;
    this.policies = policies;
    this.getters = getters;
    this.setters = setters;
    this.options = options;
    this.setNuclei(nuclei);
    this.setSanitizers(sanitizers);
    this.setValidators(validators);
  }

  public setNuclei = (nuclei?: Nuclei): void => {
    if (!nuclei) {
      this.nuclei = undefined;
      return;
    }
    const { children, repeater } = this.context;
    if (!children && !repeater) {
      throw new Error("CANNOT_HAVE_CHILDREN");
    }
    nuclei.setParent(this);
    this.nuclei = nuclei;
  }

  public setSanitizers = (sanitizers?: Sanitizers): void => {
    const context = this.context;
    if (!sanitizers) {
      this.sanitizers = SanitizeAll(context.sanitizers || []);
    } else {
      sanitizers.merge(context.sanitizers);
      this.sanitizers = sanitizers;
    }
  }

  public setValidators = (validators?: Validators): void => {
    const context = this.context;
    if (!validators) {
      this.validators = ValidateAll(context.validators || []);
    } else {
      validators.merge(context.validators);
      this.validators = validators;
    }
  }

  public grant = async ({
    isotope,
    scope,
    roles,
    options = {},
  }: PolicyGrantArgs): Promise<boolean> => {
    const { policies } = this;
    if (!policies) {
      return true;
    }
    return policies.grant({ isotope, scope, roles, options });
  }

  public validate = async ({
    isotope,
    options = {},
  }: ValidatorValidateArgs): Promise<ValidatorResult> => {
    const { validators } = this;
    return validators
      ? validators.validate({ isotope, options })
      : { valid: true, messages: [], children: [] };
  }

  public sanitize = async ({ value, isotope, options = {} }: SanitizerApplyArgs): Promise<any> => {
    const { sanitizers } = this;
    return sanitizers
      ? sanitizers.apply({ value: await value, isotope, options })
      : isotope.getValue();
  }

  public applyGetters = async ({
    isotope,
    options = {},
  }: {
    isotope: Isotope;
    options?: any;
  }): Promise<any> => {
    const getters = this.getters;
    if (!getters) {
      return isotope.getValue();
    }
    return getters.reduce(
      async (value, getter) => getter({ isotope, value, options }),
      isotope.getValue(),
    );
  }

  public applySetters = async ({
    isotope,
    options = {},
  }: {
    isotope: Isotope;
    options?: any;
  }): Promise<any> => {
    const setters = this.setters;
    if (!setters) {
      return isotope.getValue();
    }
    return setters.reduce(
      async (value, setter) => setter({ isotope, value, options }),
      isotope.getValue(),
    );
  }
}

export default (args: NucleusArgs) => new Field(args);
