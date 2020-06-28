import _ from 'lodash';
import { GrantAll, PolicyGrantArgs, Policies } from '../Policy';
import Fields from './Fields';
import { Context } from './Context';
import { Blueprint, Blueprints, BlueprintArgs, Polymorphic } from './Types';
import { Sanitizers, SanitizeAll, SanitizerApplyArgs } from '../Sanitize';
import {
  ValidateAll,
  ValidatorResult,
  Validators,
  ValidatorValidateArgs,
} from '../Validate';
import { Effect } from '../Effect/Types';
import { Options } from '../Common';
import Conditions from '../Condition/Types/Conditions';
import { LookForAll } from '../Condition';
import { Collider } from '../Interact/Types';

/**
 * A base implementation of the Blueprint field.
 * This class outlines the rules of a field and provides a blueprint to create Effects.
 * Contain Blueprint instances within Fields Blueprints instances to create groups of Fields
 * Outline your field policies, validators and sanitizers using this class
 */
export class Field implements Blueprint {
  public context: Context;

  public machine: string;

  public tags: string[] = [];

  public defaultValue: any;

  public blueprints: Blueprints | Polymorphic = Fields([]);

  public conditions: Conditions = LookForAll([]);

  public policies: Policies = GrantAll([]);

  public sanitizers: Sanitizers = SanitizeAll([]);

  public validators: Validators = ValidateAll([]);

  public options: Options = {};

  public setters: Function[] = [];

  public getters: Function[] = [];

  public label?: string;

  public parent?: Blueprint;

  public description?: string;

  /**
   * @param {Context} context
   * @param {string} machine
   * @param {string} label
   * @param description
   * @param tags
   * @param {Blueprint} parent
   * @param defaultValue
   * @param {Blueprints} blueprints
   * @param {Function[]} getters
   * @param {Function[]} setters
   * @param {Policies} policies
   * @param {Conditions} conditions
   * @param {Sanitizers} sanitizers
   * @param {Validators} validators
   * @param {any} options
   */
  constructor({
    context,
    machine,
    label,
    description,
    tags,
    parent,
    defaultValue,
    blueprints,
    getters,
    setters,
    policies,
    conditions,
    sanitizers,
    validators,
    options = {},
  }: BlueprintArgs) {
    this.context = context;
    this.machine = machine;
    this.label = label;
    this.description = description;
    this.defaultValue = defaultValue;
    this.parent = parent;
    if (tags) {
      this.tags = tags;
    }
    if (policies) {
      this.policies = policies;
    }
    if (conditions) {
      this.conditions = conditions;
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

  public setBlueprints = (blueprints?: Blueprints | Polymorphic): void => {
    if (!blueprints) {
      return;
    }
    const { children, repeater } = this.context;
    if (!children && !repeater) {
      throw new Error('CANNOT_HAVE_CHILDREN');
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

  public getDefault = (options = {}): any => {
    return _.isFunction(this.defaultValue)
      ? this.defaultValue()
      : this.defaultValue;
  };

  /**
   * Grant Challenge
   * @param {ScopeType | ScopesType} scope
   * @param {RoleType | RolesType} roles
   * @param {any} options
   * @returns {Promise<boolean>}
   */
  public grant = ({ scope, roles, options = {} }: PolicyGrantArgs): boolean => {
    const { policies } = this;
    if (!policies) {
      return true;
    }
    return policies.grant({ scope, roles, options });
  };

  /**
   * Determine Field Presence
   * @param collider
   * @param blueprint
   * @param hydrate
   * @param options
   */
  public presence = ({
    collider,
    hydrate,
    ...options
  }: {
    collider: Collider;
    hydrate: Effect;
    options?: any;
  }): boolean => {
    const { conditions } = this;
    // If there are no conditions
    // Return true as there is no need to
    if (!conditions) {
      return true;
    }
    // Otherwise run our conditions check and return the result
    return conditions.check({
      collider,
      blueprint: this,
      hydrate,
      ...options,
    });
  };

  /**
   * Validate Effect
   * @param {Effect} effect
   * @param {any} options
   * @returns {Promise<ValidatorResult>}
   */
  public validate = ({
    effect,
    options = {},
  }: ValidatorValidateArgs): ValidatorResult => {
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
  public sanitize = ({
    value,
    effect,
    options = {},
  }: SanitizerApplyArgs): any => {
    const { sanitizers } = this;
    return sanitizers
      ? sanitizers.apply({ value, effect, options })
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
  public applyGetters = ({
    effect,
    options = {},
  }: {
    effect: Effect;
    options?: any;
  }): any => {
    const getters = this.getters;
    if (!getters) {
      return effect.value;
    }
    return getters.reduce(
      (value, getter) => getter({ effect, value, options }),
      effect.value
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
  public applySetters = ({
    effect,
    options = {},
  }: {
    effect: Effect;
    options?: any;
  }): any => {
    const setters = this.setters;
    if (!setters) {
      return effect.value;
    }
    return setters.reduce(
      (value, setter) => setter({ effect, value, options }),
      effect.value
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
