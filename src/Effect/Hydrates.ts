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

  public refined?: void | Effect[];

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

  public getEffects = (): Effect[] => {
    return this.refined ? this.refined : this.effects;
  };

  public find = (criteria: Function | Object): Effect => {
    return _.find(this.getEffects(), criteria) as Effect;
  };

  public filter = (criteria: Function | Object): Effect[] => {
    return _.filter(this.getEffects(), criteria) as Effect[];
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
        await effect.sanitize(options);
        const grantCheck = await effect.grant(options);
        if (grantCheck) {
          await effect.hydrate(options);
          effects.push(effect);
        }
      })
    );
  };

  public update = async (values: any, options: any = {}): Promise<void> => {
    // tslint:disable-next-line:no-console
    console.log('RAH2');
    await Promise.all(
      // If an effect has been removed we will need to manage that here?
      this.effects.map(async (effect) => {
        const value = _.get(values, effect.machine);
        await effect.update(value, options);
        await effect.sanitize(options);
      })
    );
  };

  public refine = async (options: any = {}): Promise<void> => {
    this.refined = await this.effects.reduce(async (curr, effect) => {
      const _curr: Effect[] = await curr;
      const _check = await effect.presence(options);
      await effect.refine(options);
      if (_check && _curr.length > 0) {
        _curr.push(effect);
        return _curr;
      } else {
        return _curr;
      }
    }, Promise.all([]));
  };

  public validate = async (options: any = {}): Promise<any> => {
    const effects = this.getEffects();
    const validations: any = {};
    await Promise.all(
      effects.map(async (effect: Effect) => {
        validations[`${effect.blueprint.machine}`] = await effect.validate(options);
      })
    );
    return validations;
  };

  public sanitize = async (options: any = {}): Promise<void> => {
    const effects = this.getEffects();
    await Promise.all(
      effects.map(async (effect) => {
        await effect.sanitize(options);
      })
    );
  };

  public dump = async (
    options: any = {}
  ): Promise<{ [s: string]: ValidatorResult }> => {
    const effects = this.getEffects();
    return effects.reduce(async (curr: Promise<any>, effect: Effect) => {
      const dumped: any = await curr;
      dumped[effect.blueprint.machine] = await effect.dump(options);
      return dumped;
    }, Promise.resolve({}));
  };
}

export default (args: EffectsArgs) => new Hydrates(args);
