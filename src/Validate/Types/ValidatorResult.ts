import {Context} from "../../Nucleus/Context/Types";

export interface ValidatorResult {
  machine?: string;
  context?: Context;
  label?: string;
  valid: boolean;
  messages: string[];
  children: {[s: string]: ValidatorResult}[];
}

export default ValidatorResult;
