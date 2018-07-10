import { Isotope } from "../Isotope/Isotope";
import { getMixedResult } from "../Utils";

type FilterType = string | Function;

type FiltersType = FilterType[];

interface Sanitizer {
  filters: FiltersType;
  options: any;
  getRules(options: any): Promise<string>;
  apply({ value, isotope, ...options }: SanitizerApplyArgs): Promise<any>;
}

interface SanitizerArgs {
  filters: FiltersType;
  options: any;
}

interface SanitizerApplyArgs {
  value: any;
  isotope: Isotope;
  options: any;
}

export class SimpleSanitizer implements Sanitizer {
  public filters: FiltersType = [];

  public options: any = {};

  constructor({ filters, options = {} }: SanitizerArgs) {
    this.filters = filters;
    this.options = options;
  }

  public getRules = async (options: any = {}): Promise<string> => {
    return getMixedResult(this.filters, { ...this.options, ...options })
      .then((built) => (built.join("|")));
  }

  public apply = async ({ value, isotope, ...options }: SanitizerApplyArgs): Promise<any> => {
    const builtRules = await this.getRules(options);
    const builtValue = _.isFunction(value) ? await value(options) : value;
    return builtRules.split("|").reduce((filtered, filter) => {
      switch (filter.toLowerCase()) {
        case "string" : { return stringFilter(filtered); }
        case "float" : { return floatFilter(filtered); }
        case "int" : { return intFilter(filtered); }
        case "trim" : { return trimFilter(filtered); }
        case "upper_case" : { return uppercaseFilter(filtered); }
        case "lower_case" : { return lowercaseFilter(filtered); }
        default : { return filtered; }
      }
    }, builtValue);
  }
}

export default (args: SanitizerArgs): SimpleSanitizer => (new SimpleSanitizer(args));
