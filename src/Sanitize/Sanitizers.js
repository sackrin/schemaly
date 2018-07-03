import _ from 'lodash';

export class Sanitizers {
  filters = [];

  options;

  constructor ({ filters, ...options }) {
    this.filters = filters;
    this.options = options;
  }

  filter = async ({ value, ...options }) => {
    // Check if the passed value is a promise
    const filterValue = !_.isFunction(value) ? value : await value(options);
    // If no collect then return a pass grant
    if (this.filters.length === 0) { return filterValue; }
    // Loop through and ensure all collect pass for given value
    return this.filters.reduce(async (value, filter) => {
      return filter.apply({ value: await value, ...options });
    }, filterValue);
  }
}

export default (filters, options = {}) => (new Sanitizers({ filters, ...options }));
