import _ from 'lodash';
import ValidatorJS from 'validatorjs';
import { getMixedResult } from '../Utils';
import {
  Validator,
  RulesType,
  ValidatorArgs,
  ValidatorValidateArgs,
  ValidatorResult,
} from './Types';

/**
 * Provides validation using the validatorJS library
 * Recommended to use for simple validation
 * Refer to the validatorJS documentation on valid validation rules
 * Validation rules, such as this, should be used within a Validators instance
 */
export class SimpleValidator implements Validator {
  public rules: RulesType = [];

  public options: any = {};

  /**
   * @param {RulesType} rules
   * @param {any} options
   */
  constructor({ rules, options = {} }: ValidatorArgs) {
    this.rules = rules;
    this.options = options;
  }

  /**
   * Get Constructed Rules
   * @param options
   * @returns {Promise<string>}
   */
  public getRules = (options: any = {}): string => {
    return getMixedResult(this.rules, options).join('|');
  };

  /**
   * Validate Value
   * Values are provided within a hydrated Effect
   * @param {Effect} effect
   * @param {any} options
   * @returns {Promise<ValidatorResult>}
   */
  public validate = ({
    effect,
    options = {},
  }: ValidatorValidateArgs): ValidatorResult => {
    const value = effect.getValue();
    const usingRules: string = this.getRules({
      options: { ...options, effect },
    });
    const usingValue: any = !_.isFunction(value)
      ? value
      : value({
          effect,
          options: {
            ...this.options,
            ...options,
            effect,
          },
        });
    const validation = new ValidatorJS(
      { value: usingValue },
      { value: usingRules }
    );
    const failed = validation.fails();
    return {
      valid: !failed,
      messages: failed ? validation.errors.get('value') : [],
      children: [],
    };
  };
}

/**
 * This is the typical way to create a new validator.
 * Should be used in favour of using the primary validator class
 * @param {ValidatorArgs} args
 * @returns {SimpleValidator}
 */
export default (args: ValidatorArgs) => new SimpleValidator(args);
