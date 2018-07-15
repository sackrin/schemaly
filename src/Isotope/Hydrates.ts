import _ from "lodash";
import { Reactor } from "../Reactor/Types";
import { Nuclei } from "../Nucleus/Types";
import { Isotope, Isotopes } from "./Types";
import Hydrate from "./Hydrate";
import {ValidatorResult} from "../Validate/Types";

interface IsotopesArgs {
  parent: Isotope | Reactor;
  reactor: Reactor;
  nuclei: Nuclei;
  values: any;
  options?: any;
}

export class Hydrates implements Isotopes {
  public reactor: Reactor;

  public nuclei: Nuclei;

  public values: any;

  public parent: Isotope | Reactor;

  public isotopes: Isotope[] = [];

  public options?: any = {};

  constructor({ parent, reactor, nuclei, values, options = {} }: IsotopesArgs) {
    this.reactor = reactor;
    this.parent = parent;
    this.nuclei = nuclei;
    this.values = values;
    this.options = options;
  }

  public find = (criteria: Function | Object): Isotope => {
    const { isotopes } = this;
    return _.find(isotopes, criteria) as Isotope;
  }

  public filter = (criteria: Function | Object): Isotope[] => {
    const { isotopes } = this;
    return _.filter(isotopes, criteria) as Isotope[];
  }

  public hydrate = async (options: any = {}): Promise<void> => {
    const { reactor, nuclei, isotopes, values } = this;
    await Promise.all(nuclei.all().map(async (nucleus) => {
      const value = _.get(values, nucleus.machine);
      // const isotope = Hydrate({ parent: this, reactor, nucleus, value });
      const isotope = Hydrate({ reactor, nucleus, value, parent: this });
      if (await isotope.grant({ ...this.options, ...options })) {
        await isotope.hydrate({ ...this.options, ...options });
        isotopes.push(isotope);
      }
    }));
  }

  public validate = async (options: any = {}): Promise<any> => {
    const { isotopes } = this;
    const validations: any = {};
    await Promise.all(isotopes.map(async (isotope: Isotope) => {
      validations[`${isotope.nucleus.machine}`] = await isotope.validate({ ...this.options, ...options });
    }));
    return validations;
  }

  public sanitize = async (options: any = {}): Promise<void> => {
    const { isotopes } = this;
    await Promise.all(isotopes.map(async (isotope) => {
      await isotope.sanitize({ ...this.options, ...options });
    }));
  }

  public dump = async (options: any = {}): Promise<{[s: string]: ValidatorResult}> => {
    const { isotopes } = this;
    return isotopes.reduce(async (curr: Promise<any>, isotope: Isotope) => {
      const dumped: any = { ...await curr };
      dumped[isotope.nucleus.machine] = await isotope.dump({ ...this.options, ...options });
      return dumped;
    }, Promise.resolve({}));
  }
}

export default (args: IsotopesArgs) => new Hydrates(args);
