import _ from 'lodash';
import { getMixedResult } from '../Utils';

export const trimFilter = (value) => (value.toString().trim());

export const uppercaseFilter = (value) => (value.toString().toUpperCase());

export const lowercaseFilter = (value) => (value.toString().toLowerCase());

export const stringFilter = (value) => (value.toString());

export const intFilter = (value) => (parseInt(value));

export const floatFilter = (value) => (parseFloat(value));

export class SimpleSanitizer {
  config = {
    rules: []
  };

  options;

  constructor ({ rules, ...options }) {
    this.config = { rules };
    this.options = options;
  }

  getRules = async ({ ...options } = {}) => {
    return getMixedResult(this.config.rules, { validator: this.options, ...options })
      .then((builtRules) => (builtRules.join('|')));
  };

  apply = async ({ value, isotope, ...options }) => {
    const builtRules = await this.getRules(options);
    const builtValue = _.isFunction(value) ? await value(options) : value;
    return builtRules.split('|').reduce((filtered, filter) => {
      switch (filter.toLowerCase()) {
        case 'string' : { return stringFilter(filtered); }
        case 'float' : { return floatFilter(filtered); }
        case 'int' : { return intFilter(filtered); }
        case 'trim' : { return trimFilter(filtered); }
        case 'upper_case' : { return uppercaseFilter(filtered); }
        case 'lower_case' : { return lowercaseFilter(filtered); }
        default : { return filtered; }
      }
    }, builtValue);
  }
}

export default (args) => (new SimpleSanitizer(args));
