export class Sanitizers {
  filters: Array<any>;

  options: Object;

  constructor ({ filters, ...options }: { filters: Array<any> }) {
    this.filters = filters;
    this.options = options;
  }

  async filter ({ value, ...options }: { value: any }) {

  }
}
