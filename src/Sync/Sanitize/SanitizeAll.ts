import {
  SanitizerApplyArgs,
  SanitizersArgs,
  Sanitizer,
  Sanitizers,
} from './Types';

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

  public apply = ({ value, effect, options = {} }: SanitizerApplyArgs): any => {
    if (this.sanitizers.length === 0) {
      return value;
    }
    return this.sanitizers.reduce((curr, sanitizer) => {
      return sanitizer.apply({ value: curr, effect, options });
    }, value);
  };
}

export default (sanitizers: Sanitizer[], options: any = {}): SanitizeAll =>
  new SanitizeAll({ sanitizers, options });
