import _ from 'lodash';
import { buildRules } from './utils';
import type { BuiltRules } from './utils';

export const trimFilter = (value: any): string => (value.toString().trim());

export const uppercaseFilter = (value: any): string => (value.toString().toUpperCase());

export const lowercaseFilter = (value: any): string => (value.toString().toLowerCase());

export class SimpleSanitizer {
  config: { rules: Array<string | Function> };

  options: Object;

  constructor ({ rules, ...options }: { rules: Array<string | Function> }) {
    this.config = { rules };
    this.options = options;
  }

  async getRules ({ ...options }: Object = {}): Promise<string> {
    return buildRules(this.config.rules, { validator: this.options, ...options })
      .then((builtRules: BuiltRules): string => (builtRules.join('|')));
  }

  async apply ({ value, ...options }: { value: any }): Promise<any> {
    const builtRules = await this.getRules(options);
    const builtValue = _.isFunction(value) ? await value(options) : value;
    return _.reduce(builtRules.split('|'), (filtered, filter) => {
      switch (filter.toLowerCase()) {
        case 'trim' : { return trimFilter(filtered); }
        case 'upper_case' : { return uppercaseFilter(filtered); }
        case 'lower_case' : { return lowercaseFilter(filtered); }
        default : { return filtered; }
      }
    }, builtValue);
  }
}
