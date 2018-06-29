import _ from 'lodash';
import { Nuclei } from '../Nucleus';
import { Reactor } from '../Reactor';
import { Isotope } from './';

export type IsotopesArgs = {
  reactor: Reactor,
  nuclei: Nuclei,
  values: Array<any>,
  options?: Object
};

export class Isotopes {
  reactor: Reactor;

  nuclei: Nuclei;

  values: Object;

  isotopes: Array<Isotope> = [];

  options: Object;

  constructor ({ reactor, nuclei, values, ...options }: IsotopesArgs) {
    this.reactor = reactor;
    this.nuclei = nuclei;
    this.values = values;
    this.options = options;
  }

  find = (criteria: Object) => {
    const { isotopes } = this;
    return _.find(isotopes, criteria);
  };

  filter = (criteria: Object) => {
    const { isotopes } = this;
    return _.filter(isotopes, criteria);
  };

  hydrate = async (options: Object = {}) => {
    const { reactor, nuclei, isotopes, values } = this;
    await Promise.all(nuclei.all().map(async nucleus => {
      const value = _.get(values, nucleus.machine, undefined);
      const isotope = Isotope({ reactor, nucleus, value });
      if (await isotope.grant()) {
        isotopes.push(await isotope.hydrate());
      }
    }));
    return this;
  };

  validate = async (options:Object = {}) => {
    const { isotopes } = this;
    let validations = {};
    await Promise.all(isotopes.map(async (isotope: Isotope) => {
      validations[`${isotope.machine}`] = await isotope.validate({ ...options });
    }));
    return validations;
  };

  sanitize = async () => {
    const { isotopes, options } = this;
    await Promise.all(isotopes.map(async (isotope: Isotope) => {
      await isotope.sanitize(options);
    }));
  };
}

export default (args: IsotopesArgs) => new Isotopes(args);
