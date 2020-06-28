import { Collider, ColliderArgs } from './Types';
import { Effects } from '../Effect/Types';
import { RolesType, ScopesType } from '../Policy/Types';
import { Model } from '../Model/Types';
import { uniqMerge } from '../Utils';
import { getFlattenedEffects, Hydrates } from '../Effect';
import { ValidatorResult } from '../Validate/Types';
import { getFlattenedValidated } from '../Validate/Helpers';
import ColliderValidated from './Types/ColliderValidated';

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

  public collide = (options: any = {}): this => {
    const { model, values } = this;
    this.effects = Hydrates({
      parent: this,
      collider: this,
      blueprints: model.blueprints,
      values,
    });
    this.effects.hydrate(options);
    return this;
  };

  public refine = (options: any = {}): this => {
    if (!this.effects) {
      throw new Error('BLUEPRINTS_REQUIRED');
    }
    this.effects.refine(options);
    return this;
  };

  public sanitize = (options: any = {}): this => {
    if (!this.effects) {
      throw new Error('BLUEPRINTS_REQUIRED');
    }
    this.effects.sanitize(options);
    return this;
  };

  public validate = (options: any = {}): ColliderValidated => {
    if (!this.effects) {
      throw new Error('BLUEPRINTS_REQUIRED');
    }
    const validated = this.effects.validate(options);
    return {
      valid: Object.values(validated).reduce(
        (curr: boolean, result: ValidatorResult) =>
          !result.valid ? false : result.valid,
        true
      ),
      flatten: () => getFlattenedValidated(validated, '', {}),
      results: validated,
    };
  };

  public flatten = () => {
    if (!this.effects) {
      throw new Error('BLUEPRINTS_REQUIRED');
    }
    return getFlattenedEffects(this.effects, '', {});
  };

  public dump = (options: any = {}): any => {
    if (!this.effects) {
      throw new Error('BLUEPRINTS_REQUIRED');
    }
    return this.effects.dump(options);
  };
}

export default (args: ColliderArgs): Collider => new Collision(args);
