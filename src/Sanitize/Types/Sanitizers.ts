import { SanitizerApplyArgs, Sanitizer } from "./";

interface Sanitizers {
  sanitizers: Sanitizer[];
  options: any;
  merge(additional: Sanitizer[]): void;
  apply({ value, effect, options }: SanitizerApplyArgs): Promise<any>;
}

export default Sanitizers;
