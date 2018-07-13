import { Fields } from "../Nucleus";
import { RolesType, ScopesType } from "../Policy/Types";
import { Nuclei } from "../Nucleus/Types/Nuclei";
import { Atom, AtomArgs } from "./Types";

export class Schema implements Atom {
  public machine: string;

  public label?: string;

  public nuclei: Nuclei = Fields([]);

  public roles: RolesType = [];

  public scope: ScopesType = [];

  public options: any = {};

  constructor({ machine, roles, scope, label, nuclei, options = {} }: AtomArgs) {
    this.machine = machine;
    this.label = label;
    this.nuclei = nuclei;
    this.roles = roles;
    this.scope = scope;
    this.options = options;
  }
}

export default (args: AtomArgs): Atom => (new Schema(args));
