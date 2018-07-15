import {RolesType, ScopesType} from "../../Policy/Types";
import {Atom} from "../../Atom/Types";
import {Isotopes} from "../../Isotope/Types";
import {ValidatorResult} from "../../Validate/Types";

export interface Reactor {
  atom: Atom;
  scope: ScopesType;
  roles: RolesType;
  isotopes?: Isotopes;
  values?: any;
  options?: any;
  with(values: any): this;
  and({ values, ids }: { values: any, ids?: string[] }): this;
  react(options: any): Promise<this>;
  sanitize(options: any): Promise<this>;
  validate(options: any): Promise<{ valid: boolean, results: {[s: string]: ValidatorResult} }>;
  dump(options: any): Promise<any>;
}

export default Reactor;
