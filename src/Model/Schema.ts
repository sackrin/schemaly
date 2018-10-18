import { Fields } from '../Blueprint';
import { RolesType, RoleType, ScopesType, ScopeType } from '../Policy/Types';
import { Blueprints } from '../Blueprint/Types/Blueprints';
import { Model, ModelArgs } from './Types';
import { Options } from '../Common';
import { Collider } from '../Interact/Types';
import { Collision } from '../Interact';
import { ValidatorResult } from '../Validate/Types';

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

  /**
   * @param roles
   * @param scope
   * @param values
   * @param options
   */
  public collide = ({
    roles,
    scope,
    options
  }: {
    roles: RoleType[];
    scope: ScopeType[];
    options: Options;
  }): Collider => {
    return Collision({
      model: this,
      scope,
      roles,
      options
    });
  };

  /**
   * @param roles
   * @param scope
   * @param values
   * @param options
   */
  public handle = async ({
    roles,
    scope,
    values,
    options
  }: {
    roles: RoleType[];
    scope: ScopeType[];
    values: any;
    options: Options;
  }): Promise<{ [k: string]: any } | ValidatorResult> => {
    const collision = await this.collide({
      roles,
      scope,
      options
    });
    await collision.with(values).collide();
    await collision.sanitize(options);
    const validated = await collision.validate(options);
    if (!validated.valid) {
      return validated;
    }
    return collision.dump();
  };
}

/**
 *
 * @param {ModelArgs} args
 * @returns {Model}
 */
export default (args: ModelArgs): Model => new Schema(args);
