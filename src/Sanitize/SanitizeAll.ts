import {
  SanitizerApplyArgs,
  SanitizersArgs,
  Sanitizer,
  Sanitizers
} from "./Types";

export class SanitizeAll implements Sanitizers {
  public sanitizers: Sanitizer[] = [];

  public options: any = {};

  constructor({ sanitizers, options = {} }: SanitizersArgs) {
    this.sanitizers = sanitizers;
    this.options = options;
  }

  public merge = (additional: Sanitizer[]): void => {
    this.sanitizers = [...additional, ...this.sanitizers];
  };

  public apply = async ({
    value,
    effect,
    options = {}
  }: SanitizerApplyArgs): Promise<any> => {
    if (this.sanitizers.length === 0) {
      return Promise.resolve(value);
    }
    return this.sanitizers.reduce(async (curr, sanitizer) => {
      return sanitizer.apply({ value: await curr, effect, options });
    }, Promise.resolve(value));
  };
}

export default (sanitizers: Sanitizer[], options: any = {}): SanitizeAll =>
  new SanitizeAll({ sanitizers, options });
