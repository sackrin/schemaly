import { Validator, ValidatorResult, Validators, ValidatorsArgs, ValidatorsType, ValidatorValidateArgs } from "./Types";

/**
 * VALIDATE ALL
 * A validators collection which requires --> ALL <-- validators to pass
 * Create validators collections and attach to Nucleus instances
 */
export class ValidateAll implements Validators {
  public validators: ValidatorsType = [];

  public options: any = {};

  /**
   * @param {ValidatorsType} validators
   * @param {any} options
   */
  constructor ({ validators, options = {} }: ValidatorsArgs) {
    this.validators = validators;
    this.options = options;
  }

  /**
   * Merge Validator Rules
   * Used to add new validator rules to the existing collection
   * Also used by Nucleus contexts to influence Isotopes
   * @param {ValidatorsType} additional
   */
  public merge = (additional: ValidatorsType): void => {
    this.validators = [
      ...additional,
      ...this.validators
    ];
  };

  /**
   * Validate Value
   * Values are provided within a hydrated Isotope. Hydrated Isotope will be tested against all
   * contained validators. This validator requires --> ALL <-- validators to pass in order to validate
   * @param {Isotope} isotope
   * @param {any} options
   * @returns {Promise<ValidatorResult>}
   */
  public validate = async ({ isotope, options = {} }: ValidatorValidateArgs): Promise<ValidatorResult> => {
    const { validators } = this;
    if (validators.length === 0) {
      return {
        valid: true,
        messages: [],
        children: []
      };
    }
    return validators.reduce(async (curr: Promise<ValidatorResult>, validator: Validator) => {
      const result = await curr;
      const validationCheck = await validator.validate({ isotope, ...options });
      return {
        valid: !validationCheck.valid ? false : result.valid,
        messages: [ ...result.messages, ...validationCheck.messages ],
        children: [ ...result.children, ...validationCheck.children ]
      };
    }, Promise.resolve({
      valid: true,
      messages: [],
      children: []
    }));
  };
}

/**
 * FACTORY CALLBACK
 * This is the typical way to create a new validators.
 * Should be used in favour of using the primary validators class
 * @param {ValidatorsType} validators
 * @param options
 * @returns {ValidateAll}
 */
export default (validators: ValidatorsType, options: any = {}) => (new ValidateAll({ validators, options }));
