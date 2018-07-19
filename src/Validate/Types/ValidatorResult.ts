import { Context } from "../../Blueprint/Context/Types";

export interface ValidatorResult {
  machine?: string;
  context?: Context;
  label?: string;
  valid: boolean;
  messages: string[];
  children: Array<{ [s: string]: ValidatorResult }>;
}

export default ValidatorResult;
