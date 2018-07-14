import { Reactor } from "../../Reactor/Types";
import { Nuclei, Nucleus } from "../../Nucleus/Types";
import { Isotopes } from "./";
import { ValidatorResult } from "../../Validate/Types";

export interface Isotope {
  reactor: Reactor;
  nucleus: Nucleus;
  parent?: Isotopes;
  value: any;
  children: Isotopes[];
  options: any;
  getValue(options?: any): Promise<any>;
  setValue({ value, options }: { value: any, options?: any }): Promise<any>;
  find(criteria: Object | Function): Isotope | undefined;
  filter(criteria: Object | Function): Isotope[];
  grant(options: any): Promise<boolean>;
  hydrate(options: any): Promise<void>;
  sanitize(options: any): Promise<void>;
  validate(options: any): Promise<ValidatorResult>;
  dump(options: any): Promise<any>;
}

export default Isotope;
