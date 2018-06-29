import _ from 'lodash';

export type SanitizersArgs = {
  filters: Array<any>
};

export class Sanitizers {
  filters: Array<any> = [];

  options: Object;

  constructor ({ filters, ...options }: SanitizersArgs) {
    this.filters = filters;
    this.options = options;
  }

  filter = async ({ value, ...options }: { value: any }): Promise<any> => {
    // Check if the passed value is a promise
    const filterValue = !_.isFunction(value) ? value : await value(options);
    // If no collect then return a pass grant
    if (this.filters.length === 0) { return filterValue; }
    // Loop through and ensure all collect pass for given value
    return this.filters.reduce(async (value: any, filter: any) => {
      return filter.apply({ value: await value, ...options });
    }, filterValue);
  }
}

export default (filters: Array<any>, options: Object = {}): Sanitizers => (new Sanitizers({ filters, ...options }));
