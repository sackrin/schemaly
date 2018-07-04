import _ from 'lodash';

export class Sanitizers {
  filters = [];

  options = {};

  constructor ({ filters, ...options }) {
    this.filters = filters;
    this.options = options;
  }

  merge = (additional) => {
    if (!_.isArray(additional)) return;
    this.filters = [
      ...additional,
      ...this.filters
    ];
  };

  filter = async ({ isotope, ...options }) => {
    // If no collect then return a pass grant
    if (this.filters.length === 0) { return isotope.getValue(); }
    // Loop through and ensure all collect pass for given value
    return this.filters.reduce(async (value, filter) => {
      return filter.apply({ value: await value, isotope, ...options });
    }, isotope.getValue());
  }
}

export default (filters, options = {}) => (new Sanitizers({ filters, ...options }));
