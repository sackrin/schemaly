import { Isotope } from "../Isotope/Isotope";
import { GrantAll, PolicyGrantArgs, Policies } from "../Policy";
import Fields from "./Fields";
import { Context } from "./Context";
import { Nucleus, Nuclei, NucleusArgs } from "./Types";
import {
  Sanitizers,
  SanitizeAll,
  SanitizerApplyArgs,
} from "../Sanitize";
import {
  ValidateAll,
  ValidatorResult,
  Validators,
  ValidatorValidateArgs,
} from "../Validate";

/**
 * FIELD NUCLEUS
 * A base implementation of the Nucleus field.
 * This class outlines the rules of a field and provides a blueprint to create Isotopes.
 * Contain Nucleus instances within Fields Nuclei instances to create groups of Fields
 * Outline your field policies, validators and sanitizers using this class
 */
export class Field implements Nucleus {
  public context: Context;

  public machine: string;

  public nuclei: Nuclei = Fields([]);

  public policies: Policies = GrantAll([]);

  public sanitizers: Sanitizers = SanitizeAll([]);

  public validators: Validators = ValidateAll([]);

  public options: any = {};

  public setters: Function[] = [];

  public getters: Function[] = [];

  public label?: string;

  public parent?: Nucleus;

  /**
   * @param {Context} context
   * @param {string} machine
   * @param {string} label
   * @param {Nucleus} parent
   * @param {Nuclei} nuclei
   * @param {Function[]} getters
   * @param {Function[]} setters
   * @param {Policies} policies
   * @param {Sanitizers} sanitizers
   * @param {Validators} validators
   * @param {any} options
   */
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
    this.label = label;
    this.parent = parent;
    if (policies) { this.policies = policies; }
    if (getters) { this.getters = getters; }
    if (setters) { this.setters = setters; }
    if (options) { this.options = options; }
    this.setNuclei(nuclei);
    this.setSanitizers(sanitizers);
    this.setValidators(validators);
  }

  public setNuclei = (nuclei?: Nuclei): void => {
    if (!nuclei) { return; }
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

  /**
   * Grant Challenge
   * @param {Isotope} isotope
   * @param {ScopeType | ScopesType} scope
   * @param {RoleType | RolesType} roles
   * @param {any} options
   * @returns {Promise<boolean>}
   */
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

  /**
   * Validate Isotope
   * @param {Isotope} isotope
   * @param {any} options
   * @returns {Promise<ValidatorResult>}
   */
  public validate = async ({
    isotope,
    options = {},
  }: ValidatorValidateArgs): Promise<ValidatorResult> => {
    const { validators } = this;
    return validators
      ? validators.validate({ isotope, options })
      : { valid: true, messages: [], children: [] };
  }

  /**
   * Sanitize Value
   * Calling this WILL NOT update the value of the passed Isotope
   * @param {any} value
   * @param {Isotope} isotope
   * @param {any} options
   * @returns {Promise<any>}
   */
  public sanitize = async ({
    value,
    isotope,
    options = {},
  }: SanitizerApplyArgs): Promise<any> => {
    const { sanitizers } = this;
    return sanitizers
      ? sanitizers.apply({ value: await value, isotope, options })
      : isotope.getValue();
  }

  /**
   * Apply Getter Filters
   * Getters can be used to format values for read only
   * Should always be used to retrieve a value of an Isotope
   * @param {Isotope} isotope
   * @param {any} options
   * @returns {Promise<any>}
   */
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
      await isotope.getValue(),
    );
  }

  /**
   * Apply Setter Filters
   * Setters can be used to format values for setting a value
   * Should always be used before setting a value of an Isotope
   * PLEASE NOTE! This does not update Isotope value, just returns a filtered value
   * @param {Isotope} isotope
   * @param {any} options
   * @returns {Promise<any>}
   */
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
      await isotope.getValue(),
    );
  }
}

/**
 * FACTORY CALLBACK
 * This is the typical way to create a new field.
 * Should be used in favour of using the primary field class
 * @param {NucleusArgs} args
 * @returns {Field}
 */
export default (args: NucleusArgs) => (new Field(args));
