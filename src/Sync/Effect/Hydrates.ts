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

  public hydrate = (options: any = {}): void => {
    const { collider, blueprints, effects, values } = this;
    blueprints.all().map((blueprint) => {
      const value =
        _.get(values, blueprint.machine) !== undefined
          ? _.get(values, blueprint.machine)
          : blueprint.getDefault();
      const effect = Hydrate({ collider, blueprint, value, parent: this });
      effect.sanitize(options);
      const grantCheck = effect.grant(options);
      if (grantCheck) {
        effect.hydrate(options);
        effects.push(effect);
      }
    });
  };

  public refine = (options: any = {}): void => {
    this.effects = this.effects.reduce((_curr, effect) => {
      const _check = effect.presence(options);
      effect.refine(options);
      return _check ? [..._curr, effect] : _curr;
    }, []);
  };

  public validate = (options: any = {}): any => {
    const { effects } = this;
    const validations: any = {};
    effects.map((effect: Effect) => {
      validations[`${effect.blueprint.machine}`] = effect.validate(options);
    });
    return validations;
  };

  public sanitize = (options: any = {}): void => {
    const { effects } = this;
    effects.map((effect) => {
      effect.sanitize(options);
    });
  };

  public dump = (options: any = {}): { [s: string]: ValidatorResult } => {
    const { effects } = this;
    return effects.reduce((curr: any, effect: Effect) => {
      curr[effect.blueprint.machine] = effect.dump(options);
      return curr;
    }, {});
  };
}

export default (args: EffectsArgs) => new Hydrates(args);
