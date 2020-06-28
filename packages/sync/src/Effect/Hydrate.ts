import _ from 'lodash';
import { Collider } from '../Interact/Types';
import { Effect, EffectArgs, Effects } from './Types';
import { ValidatorResult } from '../Validate/Types';
import { Hydrates } from './index';
import { Context } from '../Blueprint/Context/Types';
import { Blueprint } from '../Blueprint/Types';
import { Options } from '../Common';

/**
 * Represents a hydrated blueprint
 */
export class Hydrate implements Effect {
  public collider: Collider;

  public blueprint: Blueprint;

  public parent?: Effects;

  public value: any;

  public children: Effects[] = [];

  public options: Options = {};

  constructor({
    parent,
    collider,
    blueprint,
    value,
    options = {},
  }: EffectArgs) {
    this.collider = collider;
    this.blueprint = blueprint;
    this.parent = parent;
    this.value = value;
    this.options = options;
  }

  get machine(): string {
    return this.blueprint.machine;
  }

  get context(): Context {
    return this.blueprint.context;
  }

  get description(): string | undefined {
    return this.blueprint.description;
  }

  get tags(): string[] | undefined {
    return this.blueprint.tags;
  }

  public getValue = (options: any = {}): any => {
    const { applyGetters } = this.blueprint;
    return applyGetters({
      effect: this,
      options,
    });
  };

  public setValue = ({
    value,
    options = {},
  }: {
    value: any;
    options: any;
  }): any => {
    const { applySetters } = this.blueprint;
    this.value = value;
    this.value = applySetters({ effect: this, ...options });
    return this.value;
  };

  public find = (criteria: Object | Function): Effect | undefined =>
    this.children.reduce((found: Effect | undefined, item: Effects) => {
      const search = item.find(criteria);
      return !found && search ? search : found;
    }, undefined);

  public filter = (criteria: Object | Function): Effect[] =>
    this.children.reduce((found: Effect[], item: Effects) => {
      const filtered = item.filter(criteria);
      return filtered.length > 0 ? [...found, ...filtered] : found;
    }, []);

  public grant = (options = {}): boolean => {
    const { grant } = this.blueprint;
    const { scope, roles } = this.collider;
    return grant({
      scope,
      roles,
      options,
    });
  };

  public presence = (options = {}): boolean =>
    this.blueprint.presence({
      collider: this.collider,
      hydrate: this,
      ...options,
    });

  public hydrate = (options = {}): void => {
    const {
      collider,
      blueprint: { context, blueprints },
      value,
    } = this;
    if ((context.children || context.repeater) && !blueprints) {
      return;
    }
    const hydrated: Effects[] = [];
    if (context.children && !context.repeater) {
      const hydrate = Hydrates({
        parent: this,
        collider,
        blueprints: blueprints.resolve(value),
        values: value,
        options,
      });
      hydrate.hydrate(options);
      hydrated.push(hydrate);
    } else if (context.children && context.repeater && _.isArray(value)) {
      value.map((childValue: any) => {
        const hydrate = Hydrates({
          parent: this,
          collider,
          blueprints: blueprints.resolve(childValue),
          values: childValue,
          options,
        });
        hydrate.hydrate(options);
        hydrated.push(hydrate);
      });
    }
    this.children = hydrated;
  };

  public refine = (options: any = {}): void => {
    const {
      blueprint: { context, blueprints },
    } = this;
    if ((context.children || context.repeater) && !blueprints) {
      return;
    }
    if (context.children) {
      this.children = this.children.reduce((_curr, hydrates) => {
        hydrates.refine(options);
        return [..._curr, hydrates];
      }, []);
    }
  };

  public sanitize = (options: any = {}): void => {
    const { blueprint, children } = this;
    this.value = blueprint.sanitize({
      value: this.value,
      effect: this,
      options,
    });
    if (blueprint.context.children || blueprint.context.repeater) {
      children.map((effects) => effects.sanitize(options));
    }
  };

  public validate = (options: any = {}): ValidatorResult => {
    const { blueprint, children } = this;
    const { machine, label, context } = blueprint;
    const validated: ValidatorResult = blueprint.validate({
      effect: this,
      options,
    });
    const result: ValidatorResult = { ...validated, machine, context, label };
    if (context.children) {
      result.children = children.map((effects) => effects.validate(options));
      result.valid = result.children.reduce(
        (curr, groupResult) =>
          Object.values(groupResult).reduce(
            (isValid, childResult) => (!childResult.valid ? false : isValid),
            curr
          ),
        result.valid
      );
    }
    return result;
  };

  public dump = (options: any = {}): any => {
    const {
      blueprint: { context },
      children,
    } = this;
    if (context.children && !context.repeater) {
      return children.length > 0 ? children[0].dump(options) : {};
    } else if (context.children && context.repeater) {
      return children.map((effects) => effects.dump(options));
    } else {
      return this.getValue();
    }
  };
}

export default (args: EffectArgs): Effect => new Hydrate(args);
