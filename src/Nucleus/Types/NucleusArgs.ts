import { Context } from "../Context/Types";
import { Policies } from "../../Policy/Types";
import { Sanitizers } from "../../Sanitize/Types";
import { Validators } from "../../Validate/Types";
import { Nucleus, Nuclei } from "./";

export interface NucleusArgs {
  machine: string;
  context: Context;
  label?: string;
  parent?: Nucleus;
  nuclei?: Nuclei;
  getters?: Function[];
  setters?: Function[];
  policies?: Policies;
  sanitizers?: Sanitizers;
  validators?: Validators;
  options?: any;
}

export default NucleusArgs;
