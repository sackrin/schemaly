import { SanitizerApplyArgs, Sanitizer } from "./index";

interface Sanitizers {
  sanitizers: Sanitizer[];
  options: any;
  merge(additional: Sanitizer[]): void;
  apply({ value, effect, options }: SanitizerApplyArgs): Promise<any>;
}

export default Sanitizers;
