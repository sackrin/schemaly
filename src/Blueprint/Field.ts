import { GrantAll, PolicyGrantArgs, Policies } from "../Policy";
import Fields from "./Fields";
import { Context } from "./Context";
import { Blueprint, Blueprints, BlueprintArgs } from "./Types";
import { Sanitizers, SanitizeAll, SanitizerApplyArgs } from "../Sanitize";
import {
  ValidateAll,
  ValidatorResult,
  Validators,
  ValidatorValidateArgs
} from "../Validate";
import { Effect } from "../Effect/Types";

/**
 * A base implementation of the Blueprint field.
 * This class outlines the rules of a field and provides a blueprint to create Effects.
 * Contain Blueprint instances within Fields Blueprints instances to create groups of Fields
 * Outline your field policies, validators and sanitizers using this class
 */
export class Field implements Blueprint {
  public context: Context;

  public machine: string;

  public blueprints: Blueprints = Fields([]);

  public policies: Policies = GrantAll([]);

  public sanitizers: Sanitizers = SanitizeAll([]);

  public validators: Validators = ValidateAll([]);

  public options: any = {};

  public setters: Function[] = [];

  public getters: Function[] = [];

  public label?: string;

  public parent?: Blueprint;

  /**
   * @param {Context} context
   * @param {string} machine
   * @param {string} label
   * @param {Blueprint} parent
   * @param {Blueprints} blueprints
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
    blueprints,
    getters,
    setters,
    policies,
    sanitizers,
    validators,
    options = {}
  }: BlueprintArgs) {
    this.context = context;
    this.machine = machine;
    this.label = label;
    this.parent = parent;
    if (policies) {
      this.policies = policies;
    }
    if (getters) {
      this.getters = getters;
    }
    if (setters) {
      this.setters = setters;
    }
    if (options) {
      this.options = options;
    }
    this.setBlueprints(blueprints);
    this.setSanitizers(sanitizers);
    this.setValidators(validators);
  }

  public setBlueprints = (blueprints?: Blueprints): void => {
    if (!blueprints) {
      return;
    }
    const { children, repeater } = this.context;
    if (!children && !repeater) {
      throw new Error("CANNOT_HAVE_CHILDREN");
    }
    blueprints.setParent(this);
    this.blueprints = blueprints;
  };

  public setSanitizers = (sanitizers?: Sanitizers): void => {
    const context = this.context;
    if (!sanitizers) {
      this.sanitizers = SanitizeAll(context.sanitizers || []);
    } else {
      sanitizers.merge(context.sanitizers);
      this.sanitizers = sanitizers;
    }
  };

  public setValidators = (validators?: Validators): void => {
    const context = this.context;
    if (!validators) {
      this.validators = ValidateAll(context.validators || []);
    } else {
      validators.merge(context.validators);
      this.validators = validators;
    }
  };

  /**
   * Grant Challenge
   * @param {Effect} effect
   * @param {ScopeType | ScopesType} scope
   * @param {RoleType | RolesType} roles
   * @param {any} options
   * @returns {Promise<boolean>}
   */
  public grant = async ({
    effect,
    scope,
    roles,
    options = {}
  }: PolicyGrantArgs): Promise<boolean> => {
    const { policies } = this;
    if (!policies) {
      return true;
    }
    return policies.grant({ effect, scope, roles, options });
  };

  /**
   * Validate Effect
   * @param {Effect} effect
   * @param {any} options
   * @returns {Promise<ValidatorResult>}
   */
  public validate = async ({
    effect,
    options = {}
  }: ValidatorValidateArgs): Promise<ValidatorResult> => {
    const { validators } = this;
    return validators
      ? validators.validate({ effect, options })
      : { valid: true, messages: [], children: [] };
  };

  /**
   * Sanitize Value
   * Calling this WILL NOT update the value of the passed Effect
   * @param {any} value
   * @param {Effect} effect
   * @param {any} options
   * @returns {Promise<any>}
   */
  public sanitize = async ({
    value,
    effect,
    options = {}
  }: SanitizerApplyArgs): Promise<any> => {
    const { sanitizers } = this;
    return sanitizers
      ? sanitizers.apply({ value: await value, effect, options })
      : effect.getValue();
  };

  /**
   * Apply Getter Filters
   * Getters can be used to format values for read only
   * Should always be used to retrieve a value of an Effect
   * @param {Effect} effect
   * @param {any} options
   * @returns {Promise<any>}
   */
  public applyGetters = async ({
    effect,
    options = {}
  }: {
    effect: Effect;
    options?: any;
  }): Promise<any> => {
    const getters = this.getters;
    if (!getters) {
      return effect.value;
    }
    return getters.reduce(
      async (value, getter) => getter({ effect, value, options }),
      await effect.value
    );
  };

  /**
   * Apply Setter Filters
   * Setters can be used to format values for setting a value
   * Should always be used before setting a value of an Effect
   * PLEASE NOTE! This does not update Effect value, just returns a filtered value
   * @param {Effect} effect
   * @param {any} options
   * @returns {Promise<any>}
   */
  public applySetters = async ({
    effect,
    options = {}
  }: {
    effect: Effect;
    options?: any;
  }): Promise<any> => {
    const setters = this.setters;
    if (!setters) {
      return effect.value;
    }
    return setters.reduce(
      async (value, setter) => setter({ effect, value, options }),
      await effect.value
    );
  };
}

/**
 * This is the typical way to create a new field.
 * Should be used in favour of using the primary field class
 * @param {BlueprintArgs} args
 * @returns {Field}
 */
export default (args: BlueprintArgs) => new Field(args);
