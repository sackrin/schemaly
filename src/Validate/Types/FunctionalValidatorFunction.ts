type FunctionalValidationResultMessage = string;

interface FunctionalValidationResult {
  valid: boolean;
  messages: FunctionalValidationResultMessage[];
}

export type FunctionalValidatorFunction = (
  value: string
) => FunctionalValidationResult;
