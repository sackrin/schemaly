import _ from 'lodash';
import { Collider } from '../Interact/Types';
import { Blueprints } from '../Blueprint/Types';
import { Effect, Effects } from './Types';
import Hydrate from './Hydrate';
import { ValidatorResult } from '../Validate/Types';

interface EffectsArgs {
  parent: Effect | Collider;
  collider: Collider;
  blueprints: Blueprints;
  values: any;
  options?: any;
}

export class Hydrates implements Effects {
  public collider: Collider;

  public blueprints: Blueprints;

  public values: any;

  public parent: Effect | Collider;

  public effects: Effect[] = [];

  public options?: any = {};

  constructor({
    parent,
    collider,
    blueprints,
    values,
    options = {},
  }: EffectsArgs) {
    this.collider = collider;
    this.parent = parent;
    this.blueprints = blueprints;
    this.values = values;
    this.options = options;
  }

  public find = (criteria: Function | Object): Effect => {
    return _.find(this.effects, criteria) as Effect;
  };

  public filter = (criteria: Function | Object): Effect[] => {
    return _.filter(this.effects, criteria) as Effect[];
  };

  public hydrate = async (options: any = {}): Promise<void> => {
    const { collider, blueprints, effects, values } = this;
    await Promise.all(
      blueprints.all().map(async (blueprint) => {
        const value =
          _.get(values, blueprint.machine) !== undefined
            ? _.get(values, blueprint.machine)
            : await blueprint.getDefault();
        const effect = Hydrate({ collider, blueprint, value, parent: this });
        await effect.sanitize({ ...this.options, ...options });
        const grantCheck = await effect.grant({ ...this.options, ...options });
        if (grantCheck) {
          await effect.hydrate({ ...this.options, ...options });
          effects.push(effect);
        }
      })
    );
  };

  public refine = async (options: any = {}): Promise<void> => {
    this.effects = await this.effects.reduce(async (curr, effect) => {
      const _curr = await curr;
      const _check = await effect.presence({
        ...this.options,
        ...options,
      });
      await effect.refine(options)
      return _check ? [..._curr, await effect.refine(options)] : _curr;
    }, Promise.all([]));
  };

  public validate = async (options: any = {}): Promise<any> => {
    const { effects } = this;
    const validations: any = {};
    await Promise.all(
      effects.map(async (effect: Effect) => {
        validations[`${effect.blueprint.machine}`] = await effect.validate({
          ...this.options,
          ...options,
        });
      })
    );
    return validations;
  };

  public sanitize = async (options: any = {}): Promise<void> => {
    const { effects } = this;
    await Promise.all(
      effects.map(async (effect) => {
        await effect.sanitize({ ...this.options, ...options });
      })
    );
  };

  public dump = async (
    options: any = {}
  ): Promise<{ [s: string]: ValidatorResult }> => {
    const { effects } = this;
    return effects.reduce(async (curr: Promise<any>, effect: Effect) => {
      const dumped: any = { ...(await curr) };
      dumped[effect.blueprint.machine] = await effect.dump({
        ...this.options,
        ...options,
      });
      return dumped;
    }, Promise.resolve({}));
  };
}

export default (args: EffectsArgs) => new Hydrates(args);
