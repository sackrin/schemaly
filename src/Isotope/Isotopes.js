import _ from 'lodash';
import { Nuclei } from '../Nucleus';
import { Reactor } from '../Reactor';
import { Isotope } from './';

export type IsotopesArgs = {
  reactor: Reactor,
  nuclei: Nuclei,
  roles: Array<string | Function>,
  scope: Array<string | Function>,
  options?: Object
};

export class Isotopes {
  reactor: Reactor;

  nuclei: Nuclei;

  isotopes: Array<Isotope> = [];

  roles: Array<string | Function> = [];

  scope: Array<string | Function> = [];

  options: Object;

  constructor ({ reactor, grouped, nuclei, scope, roles, ...options }: IsotopesArgs) {
    this.reactor = reactor;
    this.nuclei = nuclei;
    this.scope = scope;
    this.roles = roles;
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

  hydrate = async ({ values }: { values: Object }) => {
    const { reactor, nuclei, isotopes, scope, roles } = this;
    await Promise.all(nuclei.all().map(async nucleus => {
      const { machine, grant, type } = nucleus;
      const value = _.get(values, machine, undefined);
      const isotope = Isotope({ reactor, nucleus, value });
      if (!await grant({ isotope, scope, roles })) { return; }
      if ((type.children || type.repeater) && !nucleus.nuclei) {
        throw new Error('NUCLEUS_EXPECTS_CHILDREN');
      }
      if (type.children && !type.repeater) {
        isotope.isotopes = new Isotopes({ reactor, nucleus, nuclei: nucleus.nuclei, scope, roles });
        await isotope.isotopes.hydrate({ values: await isotope.getValue() });
      } else if (type.children && type.repeater) {
        const items = await isotope.getValue();
        isotope.isotopes = [];
        await Promise.all(items.map(async item => {
          const group = new Isotopes({ reactor, nuclei: nucleus.nuclei, scope, roles });
          await group.hydrate({ values: item });
          isotope.isotopes.push(group);
        }));
      }
      isotopes.push(isotope);
    }));
    return this;
  };

  validate = async (options:Object = {}) => {
    const { isotopes } = this;
    let validations = {};
    let valid = true;
    await Promise.all(isotopes.map(async (isotope: Isotope) => {
      const validated = await isotope.validate({ ...options });
      if (validated.result === false) { valid = false; }
      validations[`${isotope.machine}`] = validated;
    }));
    return {
      result: valid,
      isotopes: validations
    };
  };
}

export default (args: IsotopesArgs) => new Isotopes(args);
