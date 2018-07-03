import _ from 'lodash';
import { Isotope } from './';

export class Isotopes {
  reactor;

  nuclei;

  values;

  isotopes = [];

  options;

  constructor ({ reactor, nuclei, values, ...options }) {
    this.reactor = reactor;
    this.nuclei = nuclei;
    this.values = values;
    this.options = options;
  }

  find = (criteria) => {
    const { isotopes } = this;
    return _.find(isotopes, criteria);
  };

  filter = (criteria) => {
    const { isotopes } = this;
    return _.filter(isotopes, criteria);
  };

  hydrate = async (options = {}) => {
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

  validate = async (options = {}) => {
    const { isotopes } = this;
    let validations = {};
    await Promise.all(isotopes.map(async (isotope) => {
      validations[`${isotope.machine}`] = await isotope.validate({ ...options });
    }));
    return validations;
  };

  sanitize = async () => {
    const { isotopes, options } = this;
    await Promise.all(isotopes.map(async (isotope) => {
      await isotope.sanitize(options);
    }));
  };

  dump = async () => {
    const { isotopes } = this;
    return isotopes.reduce(async (curr, isotope) => {
      const dumped = { ...await curr };
      dumped[isotope.machine] = await isotope.dump();
      return dumped;
    }, {});
  }
}

export default (args) => new Isotopes(args);
