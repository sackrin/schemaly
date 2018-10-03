import { Fields } from "../Blueprint";
import { RolesType, ScopesType } from "../Policy/Types";
import { Blueprints } from "../Blueprint/Types/Blueprints";
import { Model, ModelArgs } from "./Types";
import { Options } from '../Common';

export class Schema implements Model {
  public machine: string;

  public label?: string;

  public blueprints: Blueprints = Fields([]);

  public roles: RolesType = [];

  public scope: ScopesType = [];

  public options: Options = {};

  /**
   * @param {string} machine
   * @param {RolesType} roles
   * @param {ScopesType} scope
   * @param {string} label
   * @param {Blueprints} blueprints
   * @param {Options} options
   */
  constructor({
    machine,
    roles,
    scope,
    label,
    blueprints,
    options = {}
  }: ModelArgs) {
    this.machine = machine;
    this.label = label;
    this.blueprints = blueprints;
    this.roles = roles;
    this.scope = scope;
    this.options = options;
  }
}

/**
 *
 * @param {ModelArgs} args
 * @returns {Model}
 */
export default (args: ModelArgs): Model => new Schema(args);
