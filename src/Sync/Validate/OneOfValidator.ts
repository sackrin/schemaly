import _ from 'lodash';
import { getMixedResult } from '../Utils';
import {
  Validator,
  RulesType,
  ValidatorArgs,
  ValidatorValidateArgs,
  ValidatorResult,
} from './Types';

/**
 * Provides one of validation
 * Recommended to use to validate against a list of accepted values
 * Validation rules, such as this, should be used within a Validators instance
 */
export class OneOfValidator implements Validator {
  public rules: RulesType = [];

  public options: any = {};

  /**
   * @param rules
   * @param options
   */
  constructor({ rules, options = {} }: ValidatorArgs) {
    this.rules = rules;
    this.options = options;
  }

  /**
   * Get Constructed Rules
   * @param options
   */
  public getRules = (options: any = {}): string => {
    return getMixedResult(this.rules, options).join('|');
  };

  /**
   * Validate Value
   * @param effect
   * @param options
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

    if (usingRules.split('|').indexOf(usingValue) > -1) {
      return {
        valid: true,
        messages: [],
        children: [],
      };
    } else {
      return {
        valid: false,
        messages: ['the value must match one of the allowed values.'],
        children: [],
      };
    }
  };
}

export default (args: ValidatorArgs) => new OneOfValidator(args);
