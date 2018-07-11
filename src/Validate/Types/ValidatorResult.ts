export interface ValidatorResult {
  valid: boolean;
  messages: string[];
  children: ValidatorResult[];
}

export default ValidatorResult;
