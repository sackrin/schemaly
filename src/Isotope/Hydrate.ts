import { Nucleus } from "../Nucleus/Types";
import { Reactor } from "../Reactor/Types";
import { Isotope, IsotopeArgs, Isotopes } from "./Types";
import { ValidatorResult } from "../Validate/Types";
import { Hydrates } from "./";

export class Hydrate implements Isotope {
  public reactor: Reactor;

  public nucleus: Nucleus;

  public parent?: Isotopes;

  public value: any;

  public children: Isotopes[] = [];

  public options: any = {};

  constructor({ parent, reactor, nucleus, value, options = {} }: IsotopeArgs) {
    this.reactor = reactor;
    this.nucleus = nucleus;
    this.parent = parent;
    this.value = value;
    this.options = options;
  }

  public getValue = async (options: any = {}): Promise<any> => {
    const { applyGetters } = this.nucleus;
    return applyGetters({ isotope: this, options: { ...this.options, ...options } });
  }

  public setValue = async ({ value, options = {} }: { value: any, options: any }): Promise<any> => {
    const { applySetters } = this.nucleus;
    this.value = await value;
    this.value = await applySetters({ isotope: this, ...options });
    return this.value;
  }

  public find = (criteria: Object | Function): Isotope | undefined => {
    return this.children.reduce((found: Isotope | undefined, item: Isotopes) => {
      const search = item.find(criteria);
      return !found && search ? search : found;
    }, undefined);
  }

  public filter = (criteria: Object | Function): Isotope[] => {
    return this.children.reduce((found: Isotope[], item: Isotopes) => {
      const filtered = item.filter(criteria);
      return filtered.length > 0 ? [ ...found, ...filtered ] : found;
    }, []);
  }

  public grant = async (options = {}): Promise<boolean> => {
    const { grant } = this.nucleus;
    const { scope, roles } = this.reactor;
    return grant({ isotope: this, scope, roles, options: { ...this.options, ...options } });
  }

  public hydrate = async (options = {}): Promise<void> => {
    const { reactor, nucleus: { context, nuclei }, value } = this;
    if ((context.children || context.repeater) && !nuclei) {
      throw new Error("NUCLEUS_EXPECTS_CHILDREN");
    }
    const hydrated: Isotopes[] = [];
    if (context.children && !context.repeater) {
      const hydrate = Hydrates({
        parent: this,
        reactor,
        nuclei,
        values: value,
        options: {
          ...this.options,
          ...options,
        },
      });
      await hydrate.hydrate({ ...this.options, ...options });
      hydrated.push(hydrate);
    } else if (context.children && context.repeater) {
      await Promise.all(value.map(async (childValue: any) => {
        const hydrate = Hydrates({
          parent: this,
          reactor,
          nuclei,
          values: childValue,
          options: {
            ...this.options,
            ...options,
          },
        });
        await hydrate.hydrate({ ...this.options, ...options });
      }));
    }
    this.children = hydrated;
  }

  public sanitize = async (options: any = {}): Promise<void> => {
    const { nucleus, children } = this;
    this.value = await nucleus.sanitize({ value: this.value, isotope: this, options: { ...this.options, ...options } });
    if (nucleus.context.children || nucleus.context.repeater) {
      await Promise.all(children.map(async (isotopes) => (isotopes.sanitize({ ...this.options, ...options }))));
    }
  }

  public validate = async (options: any = {}): Promise<ValidatorResult> => {
    const { nucleus, children } = this;
    const { machine, label, context } = nucleus;
    const validated: ValidatorResult = await nucleus.validate({
      isotope: this,
      options: {
        ...this.options,
        ...options,
      },
    });
    const result: ValidatorResult = { ...validated, machine, context, label };
    if (context.children) {
      result.children = await Promise.all(
        children.map(async (isotopes) => (isotopes.validate({ ...this.options, ...options }))),
      );
      result.valid = result.children.reduce((curr, groupResult) => (
        Object.values(groupResult).reduce(
          (isValid, childResult) => (childResult.valid !== true ? false : isValid)
        , curr)
      ), result.valid);
    }
    return result;
  }

  public dump = async (options: any = {}): Promise<any> => {
    const { nucleus: { context }, children } = this;
    if (context.children && !context.repeater) {
      return children.length > 0 ? children[0].dump({ ...this.options, ...options }) : {};
    } else if (context.children && context.repeater) {
      return Promise.all(children.map(async (isotopes) => (isotopes.dump({ ...this.options, ...options }))));
    } else {
      return this.getValue();
    }
  }
}

export default (args: IsotopeArgs): Isotope => (new Hydrate(args));
