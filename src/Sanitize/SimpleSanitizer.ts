import _ from "lodash";
import { getMixedResult } from "../Utils";
import { floatFilter, intFilter, lowerCaseFilter, stringFilter, trimFilter, upperCaseFilter } from "./Filter";
import { FiltersType, Sanitizer, SanitizerApplyArgs, SanitizerArgs } from "./Types";

export class SimpleSanitizer implements Sanitizer {
  public filters: FiltersType = [];

  public options: any = {};

  constructor({ filters, options = {} }: SanitizerArgs) {
    this.filters = filters;
    this.options = options;
  }

  public getFilters = async (options: any = {}): Promise<string> => {
    return getMixedResult(this.filters, { ...this.options, ...options })
      .then((built) => (built.join("|")));
  }

  public apply = async ({ value, isotope, ...options }: SanitizerApplyArgs): Promise<any> => {
    const filters: string = await this.getFilters(options);
    const unsanitized: any = _.isFunction(value) ? await value(options) : value;
    return filters.split("|").reduce((filtered: any, filter: string) => {
      switch (filter.toLowerCase()) {
        case "string" : { return stringFilter(filtered); }
        case "float" : { return floatFilter(filtered); }
        case "int" : { return intFilter(filtered); }
        case "trim" : { return trimFilter(filtered); }
        case "upper_case" : { return upperCaseFilter(filtered); }
        case "lower_case" : { return lowerCaseFilter(filtered); }
        default : { return filtered; }
      }
    }, Promise.resolve(unsanitized));
  }
}

export default (args: SanitizerArgs): SimpleSanitizer => (new SimpleSanitizer(args));
