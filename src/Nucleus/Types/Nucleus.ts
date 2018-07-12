import {Context} from "../Context/Types";
import {Isotope} from "../../Isotope/Isotope";
import {Policies} from "../../Policy/Types";
import {SanitizerApplyArgs, Sanitizers} from "../../Sanitize/Types";
import {PolicyGrantArgs} from "../../Policy";
import {ValidatorResult, Validators, ValidatorValidateArgs} from "../../Validate/Types";
import {Nuclei} from "../";

export interface Nucleus {
  context: Context;
  machine: string;
  label?: string;
  parent?: Nucleus;
  nuclei?: Nuclei;
  options?: any;
  policies?: Policies;
  sanitizers: Sanitizers;
  validators: Validators;
  setters?: Function[];
  getters?: Function[];
  setNuclei(nuclei?: Nuclei): void;
  setSanitizers(sanitizers?: Sanitizers): void;
  setValidators(validators?: Validators): void;
  grant({ isotope, scope, roles, options }: PolicyGrantArgs): Promise<boolean>;
  validate({ isotope, options }: ValidatorValidateArgs): Promise<ValidatorResult>;
  sanitize({ isotope, options }: SanitizerApplyArgs): Promise<any>;
  applyGetters({ isotope, options }: { isotope: Isotope, options?: any }): Promise<any>;
  applySetters({ isotope, options }: { isotope: Isotope, options?: any }): Promise<any>;
}

export default Nucleus;
