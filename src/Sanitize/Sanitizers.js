export class Sanitizers {
  filters = [];

  options;

  constructor ({ filters, ...options }) {
    this.filters = filters;
    this.options = options;
  }

  filter = async ({ isotope, ...options }) => {
    // Retrieve the isotope value
    const value = await isotope.getValue();
    // If no collect then return a pass grant
    if (this.filters.length === 0) { return value; }
    // Loop through and ensure all collect pass for given value
    return this.filters.reduce(async (value, filter) => {
      return filter.apply({ value: await value, isotope, ...options });
    }, value);
  }
}

export default (filters, options = {}) => (new Sanitizers({ filters, ...options }));
