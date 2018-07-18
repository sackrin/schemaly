import { Reactor } from "../../Reactor/Types";
import { Nucleus } from "../../Nucleus/Types";
import { Isotopes } from "./index";

export interface IsotopeArgs {
  reactor: Reactor;
  nucleus: Nucleus;
  parent?: Isotopes;
  value: any;
  options?: any;
}

export default IsotopeArgs;
