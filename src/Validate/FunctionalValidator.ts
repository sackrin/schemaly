import {
  Validator,
  RulesType,
  ValidatorValidateArgs,
  ValidatorResult,
} from './Types';
import _ from 'lodash';
import { FunctionalValidatorFunction } from './Types/FunctionalValidatorFunction';

type FunctionalValidatorArgs = FunctionalValidatorFunction[];

/**
 * Validate using an array of arbitrary functions. If any one of them fails then
 * validation as a whole fails. The messages from all functions are returned as
 * a flat array.
 */
export class FunctionalValidator implements Validator {
  public rules: RulesType = [];
  public options: any = {};

  private validatorFuncs: FunctionalValidatorFunction[] = [];

  constructor(validatorFuncs: FunctionalValidatorArgs) {
    this.validatorFuncs = validatorFuncs;
  }

  public getRules = async (options: any = {}): Promise<string> =>
    Promise.resolve('');

  public validate = async ({
    effect,
    options = {},
  }: ValidatorValidateArgs): Promise<ValidatorResult> => {
    const value = await effect.getValue();
    const usingValue: any = !_.isFunction(value)
      ? value
      : await value({
          effect,
          options: {
            ...this.options,
            ...options,
            effect,
          },
        });

    // Run each validatorFunc and build a validation result.
    const initialValue: ValidatorResult = {
      valid: true,
      messages: [],
      children: [],
    };
    return this.validatorFuncs.reduce((accumulator, currentValue) => {
      const validationFuncResult = currentValue(usingValue);
      if (!validationFuncResult.valid) {
        accumulator.valid = false;
        accumulator.messages = [
          ...accumulator.messages,
          ...validationFuncResult.messages,
        ];
      }
      return accumulator;
    }, initialValue);
  };
}

/**
 * Allow usage as a function without having to explicitly initialize an object
 * with "new". Eg: "FunctionalValidator([func1])".
 */
export default (args: FunctionalValidatorArgs) => new FunctionalValidator(args);
