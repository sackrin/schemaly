type FunctionalValidatorResultMessage = string;

interface FunctionalValidatorResult {
  valid: boolean;
  messages: FunctionalValidatorResultMessage[];
}

type FunctionalValidatorFunction = (value: any) => FunctionalValidatorResult;

export default FunctionalValidatorFunction;
