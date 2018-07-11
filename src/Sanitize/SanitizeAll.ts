import { SanitizersType, SanitizerApplyArgs, SanitizersArgs, Sanitizers } from "./Types";

export class SanitizeAll implements Sanitizers {
  public sanitizers: SanitizersType = [];

  public options: any = {};

  constructor({ sanitizers, options = {} }: SanitizersArgs) {
    this.sanitizers = sanitizers;
    this.options = options;
  }

  public merge = (additional: SanitizersType): void => {
    this.sanitizers = [ ...additional, ...this.sanitizers ];
  }

  public apply = async ({ value, isotope, options = {} }: SanitizerApplyArgs): Promise<any> => {
    if (this.sanitizers.length === 0) { return Promise.resolve(value); }
    return this.sanitizers.reduce(async (curr, sanitizer) => {
      return sanitizer.apply({ value: await curr, isotope, options });
    }, Promise.resolve(value));
  }
}

export default (
  sanitizers: SanitizersType,
  options: any = {}): SanitizeAll => (
    new SanitizeAll({ sanitizers, options })
);
