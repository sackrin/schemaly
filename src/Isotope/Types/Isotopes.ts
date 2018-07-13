import {Reactor} from "../../Reactor/Types";
import {Nuclei} from "../../Nucleus/Types";
import {Isotope} from "./index";

export interface Isotopes {
  reactor: Reactor;
  nuclei: Nuclei;
  values: any;
  parent: Isotope;
  isotopes: Isotope[];
  options: any;
  find(criteria: Function | Object): Isotope;
  filter(criteria: Function | Object): Isotope[];
  hydrate(options: any): Promise<void>;
  validate(options: any): Promise<any>;
  sanitize(options: any): Promise<void>;
  dump(options: any): Promise<any>;
}

export default Isotopes;
