import _ from 'lodash';
import { Collider } from '../Interact/Types';
import { Effect, EffectArgs, Effects } from './Types';
import { ValidatorResult } from '../Validate/Types';
import { Hydrates } from './';
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

  public refined?: void | Effects[];

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

  public getChildren = (): Effects[] => {
    return this.refined ? this.refined : this.children;
  };

  public getValue = async (options: any = {}): Promise<any> => {
    const { applyGetters } = this.blueprint;
    return applyGetters({
      effect: this,
      options,
    });
  };

  public setValue = async ({
    value,
    options = {},
  }: {
    value: any;
    options: any;
  }): Promise<any> => {
    const { applySetters } = this.blueprint;
    this.value = await value;
    this.value = await applySetters({ effect: this, ...options });
    return this.value;
  };

  public find = (criteria: Object | Function): Effect | undefined => {
    return this.getChildren().reduce((found: Effect | undefined, item: Effects) => {
      const search = item.find(criteria);
      return !found && search ? search : found;
    }, undefined);
  };

  public filter = (criteria: Object | Function): Effect[] => {
    return this.getChildren().reduce((found: Effect[], item: Effects) => {
      const filtered = item.filter(criteria);
      return filtered.length > 0 ? [...found, ...filtered] : found;
    }, []);
  };

  public grant = async (options = {}): Promise<boolean> => {
    const { grant } = this.blueprint;
    const { scope, roles } = this.collider;
    return grant({
      scope,
      roles,
      options,
    });
  };

  public presence = async (options = {}): Promise<boolean> =>
    this.blueprint.presence({
      collider: this.collider,
      hydrate: this,
      ...options,
    });

  public hydrate = async (options = {}): Promise<void> => {
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
      await hydrate.hydrate(options);
      hydrated.push(hydrate);
    } else if (context.children && context.repeater && _.isArray(value)) {
      await Promise.all(
        value.map(async (childValue: any) => {
          const hydrate = Hydrates({
            parent: this,
            collider,
            blueprints: blueprints.resolve(childValue),
            values: childValue,
            options
          });
          await hydrate.hydrate(options);
          hydrated.push(hydrate);
        })
      );
    }
    this.children = hydrated;
  };

  public update = async (value: any, options?: any): Promise<void> => {
    await this.setValue(value);
  }

  public refine = async (options: any = {}): Promise<void> => {
    const {
      blueprint: { context, blueprints }
    } = this;
    if ((context.children || context.repeater) && !blueprints) {
      return;
    }
    if (context.children) {
      this.refined = await this.children.reduce(async (curr, hydrates) => {
        const _curr: Effects[] = await curr;
        await hydrates.refine(options);
        _curr.push(hydrates);
        return _curr;
      }, Promise.all([]));
    }
  };

  public sanitize = async (options: any = {}): Promise<void> => {
    const { blueprint } = this;
    const children = this.getChildren();
    this.value = await blueprint.sanitize({
      value: this.value,
      effect: this,
      options: { ...this.options, ...options },
    });
    if (blueprint.context.children || blueprint.context.repeater) {
      await Promise.all(
        children.map(async (effects) =>
          effects.sanitize({ ...this.options, ...options })
        )
      );
    }
  };

  public validate = async (options: any = {}): Promise<ValidatorResult> => {
    const { blueprint } = this;
    const { machine, label, context } = blueprint;
    const children = this.getChildren();
    const validated: ValidatorResult = await blueprint.validate({
      effect: this,
      options,
    });
    const result: ValidatorResult = { ...validated, machine, context, label };
    if (context.children) {
      result.children = await Promise.all(
        children.map(async (effects) =>
          effects.validate(options)
        )
      );
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

  public dump = async (options: any = {}): Promise<any> => {
    const {
      blueprint: { context }
    } = this;
    const children = this.getChildren();
    if (context.children && !context.repeater) {
      return children.length > 0
        ? children[0].dump(options)
        : {};
    } else if (context.children && context.repeater) {
      return Promise.all(
        children.map(async (effects) =>
          effects.dump(options)
        )
      );
    } else {
      return this.getValue();
    }
  };
}

export default (args: EffectArgs): Effect => new Hydrate(args);
