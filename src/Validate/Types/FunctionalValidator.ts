type FunctionalValidatorResultMessage = string;

interface FunctionalValidatorResult {
  valid: boolean;
  messages: FunctionalValidatorResultMessage[];
}

export type FunctionalValidatorFunction = (
  value: any
) => FunctionalValidatorResult;

export type TestFunc = (value: any) => FunctionalValidatorResult;
