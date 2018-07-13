import { Reactor } from "./Types";
import { Isotopes } from "../Isotope/Types";
import { RolesType, ScopesType } from "../Policy/Types";
import { Atom } from "../Atom/Types";

interface ReactorArgs {
  atom: Atom;
  roles: RolesType;
  scope: ScopesType;
  values: any;
  options: any;
  with(values: any): this;
}

export class Chamber implements Reactor {
  public atom: Atom;

  public roles: RolesType;

  public scope: ScopesType;

  public isotopes: Isotopes;

  public values: any;

  public options: any = {};

  constructor({ atom, roles, scope, options = {} }: ReactorArgs) {
    this.atom = atom;
    this.roles = roles;
    this.scope = scope;
    this.options = options;
  }

  public with = (values: any): this => {
    this.values = values;
    return this;
  }
}

export default (args) => (new Chamber(args));
