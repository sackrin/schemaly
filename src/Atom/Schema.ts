import { Fields } from "../Nucleus";
import { RolesType, ScopesType } from "../Policy/Types";
import { Nuclei } from "../Nucleus/Types/Nuclei";
import { Atom, AtomArgs } from "./Types";

/**
 * ATOM SCHEMA
 */
export class Schema implements Atom {
  public machine: string;

  public label?: string;

  public nuclei: Nuclei = Fields([]);

  public roles: RolesType = [];

  public scope: ScopesType = [];

  public options: any = {};

  /**
   * @param {string} machine
   * @param {RolesType} roles
   * @param {ScopesType} scope
   * @param {string} label
   * @param {Nuclei} nuclei
   * @param {any} options
   */
  constructor({
    machine,
    roles,
    scope,
    label,
    nuclei,
    options = {}
  }: AtomArgs) {
    this.machine = machine;
    this.label = label;
    this.nuclei = nuclei;
    this.roles = roles;
    this.scope = scope;
    this.options = options;
  }
}

/**
 *
 * @param {AtomArgs} args
 * @returns {Atom}
 */
export default (args: AtomArgs): Atom => new Schema(args);
