import { ValidatorResult, ValidatorValidateArgs, ValidatorsType } from "./";

export interface Validators {
  validators: ValidatorsType;
  options: any;
  merge(additional: ValidatorsType): void;
  validate({
    isotope,
    options
  }: ValidatorValidateArgs): Promise<ValidatorResult>;
}

export default Validators;
