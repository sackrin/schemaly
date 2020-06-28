import FiltersType from './FiltersType';
import SanitizerApplyArgs from './SanitizerApplyArgs';

export interface Sanitizer {
  filters: FiltersType;
  options: any;
  getFilters(options: any): string;
  apply({ value, effect, ...options }: SanitizerApplyArgs): any;
}

export default Sanitizer;
