import { SanitizerApplyArgs, SanitizersType } from "./";

interface Sanitizers {
  sanitizers: SanitizersType;
  options: any;
  merge(additional: SanitizersType): void;
  apply({ value, isotope, options }: SanitizerApplyArgs): Promise<any>;
}

export default Sanitizers;
