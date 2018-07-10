import FiltersType from "./FiltersType";
import SanitizerApplyArgs from "./SanitizerApplyArgs";

export interface Sanitizer {
  filters: FiltersType;
  options: any;
  getFilters(options: any): Promise<string>;
  apply({ value, isotope, ...options }: SanitizerApplyArgs): Promise<any>;
}

export default Sanitizer;
