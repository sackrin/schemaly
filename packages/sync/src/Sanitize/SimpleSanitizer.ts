import _ from 'lodash';
import { getMixedResult } from '../Utils';
import {
  floatFilter,
  intFilter,
  lowerCaseFilter,
  stringFilter,
  stringArrayFilter,
  trimFilter,
  upperCaseFilter,
} from './Filter';
import {
  FiltersType,
  Sanitizer,
  SanitizerApplyArgs,
  SanitizerArgs,
} from './Types';

/**
 * Provides a simple sanitizer with commonly used sanitizers
 * You should generally always at least trim
 * This sanitizer is leveraged by blueprint contexts
 */
export class SimpleSanitizer implements Sanitizer {
  public filters: FiltersType = [];

  public options: any = {};

  /**
   * @param {FiltersType} filters
   * @param {any} options
   */
  constructor({ filters, options = {} }: SanitizerArgs) {
    this.filters = filters;
    this.options = options;
  }

  /**
   * Get Constructed Filters
   * @param options
   * @returns {Promise<string>}
   */
  public getFilters = (options: any = {}): string => {
    return getMixedResult(this.filters, options).join('|');
  };

  /**
   * Apply Filters To Value
   * @param {any} value
   * @param {Effect} effect
   * @param {any} options
   * @returns {Promise<any>}
   */
  public apply = ({ value, effect, options }: SanitizerApplyArgs): any => {
    const filters: string = this.getFilters(options);
    const unsanitized: any = _.isFunction(value) ? value(options) : value;
    return filters.split('|').reduce((filtered: any, filter: string) => {
      switch (filter.toLowerCase()) {
        case 'string': {
          return stringFilter(filtered);
        }
        case 'string_array': {
          return stringArrayFilter(filtered);
        }
        case 'float': {
          return floatFilter(filtered);
        }
        case 'int': {
          return intFilter(filtered);
        }
        case 'trim': {
          return trimFilter(filtered);
        }
        case 'upper_case': {
          return upperCaseFilter(filtered);
        }
        case 'lower_case': {
          return lowerCaseFilter(filtered);
        }
        default: {
          return filtered;
        }
      }
    }, unsanitized);
  };
}

/**
 * This is the typical way to create a new sanitizer.
 * Should be used in favour of using the primary sanitizer class
 * @param {SanitizerArgs} args
 * @returns {SimpleSanitizer}
 */
export default (args: SanitizerArgs): SimpleSanitizer =>
  new SimpleSanitizer(args);
