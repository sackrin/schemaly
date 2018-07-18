import { Reactor } from "../../Reactor/Types";
import { Nuclei } from "../../Nucleus/Types";
import { Isotope } from "./index";
import { ValidatorResult } from "../../Validate/Types";

export interface Isotopes {
  reactor: Reactor;
  nuclei: Nuclei;
  values: any;
  parent: Isotope | Reactor;
  isotopes: Isotope[];
  options?: any;
  find(criteria: Function | Object): Isotope;
  filter(criteria: Function | Object): Isotope[];
  hydrate(options: any): Promise<void>;
  validate(options: any): Promise<{ [s: string]: ValidatorResult }>;
  sanitize(options: any): Promise<void>;
  dump(options: any): Promise<any>;
}

export default Isotopes;
