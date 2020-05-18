import { Collider, ColliderArgs } from './Types';
import { Effects } from '../Effect/Types';
import { RolesType, ScopesType } from '../Policy/Types';
import { Model } from '../Model/Types';
import { uniqMerge } from '../Utils';
import { getFlattenedEffects, Hydrates } from '../Effect';
import { ValidatorResult } from '../Validate/Types';

export class Collision implements Collider {
  public model: Model;

  public roles: RolesType;

  public scope: ScopesType;

  public effects?: Effects;

  public values?: any;

  public options?: any = {};

  constructor({ model, roles, scope, options = {} }: ColliderArgs) {
    this.model = model;
    this.roles = roles;
    this.scope = scope;
    this.options = options;
  }

  public with = (values: any): this => {
    this.values = values;
    return this;
  };

  public and = ({
    values,
    ids = [],
  }: {
    values: any;
    ids?: string[];
  }): this => {
    this.values = uniqMerge({ ...this.values }, values, ids);
    return this;
  };

  public collide = async (options: any = {}): Promise<this> => {
    const { model, values } = this;
    this.effects = Hydrates({
      parent: this,
      collider: this,
      blueprints: model.blueprints,
      values,
    });
    await this.effects.hydrate(options);
    return this;
  };

  public sanitize = async (options: any = {}): Promise<this> => {
    if (!this.effects) {
      throw new Error('BLUEPRINTS_REQUIRED');
    }
    await this.effects.sanitize(options);
    return this;
  };

  public validate = async (
    options: any = {}
  ): Promise<{ valid: boolean; results: { [s: string]: ValidatorResult } }> => {
    if (!this.effects) {
      throw new Error('BLUEPRINTS_REQUIRED');
    }
    const validated = await this.effects.validate(options);
    return {
      valid: Object.values(validated).reduce(
        (curr: boolean, result: ValidatorResult) =>
          !result.valid ? false : result.valid,
        true
      ),
      results: validated,
    };
  };

  public flatten = () => {
    if (!this.effects) {
      throw new Error('BLUEPRINTS_REQUIRED');
    }
    return getFlattenedEffects(this.effects, '', {});
  };

  public dump = async (options: any = {}): Promise<any> => {
    if (!this.effects) {
      throw new Error('BLUEPRINTS_REQUIRED');
    }
    return this.effects.dump(options);
  };
}

export default (args: ColliderArgs): Collider => new Collision(args);
