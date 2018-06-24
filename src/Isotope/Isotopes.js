import _ from 'lodash';
import { NucleusGroup, context } from '../Nucleus';
import { Reactor } from '../Reactor';
import { Isotope } from './';

export type IsotopesArgs = {
  reactor: Reactor,
  nuclei: NucleusGroup,
  roles: Array<string | Function>,
  scope: Array<string | Function>,
  options?: Object
};

export class Isotopes {
  reactor: Reactor;

  nuclei: NucleusGroup;

  isotopes: Array<Isotope> = [];

  roles: Array<string | Function> = [];

  scope: Array<string | Function> = [];

  options: Object;

  constructor ({ reactor, nuclei, scope, roles, ...options }: IsotopesArgs) {
    this.reactor = reactor;
    this.nuclei = nuclei;
    this.scope = scope;
    this.roles = roles;
    this.options = options;
  }

  hydrate = async ({ values }: { values: Object }) => {
    const { reactor, nuclei, isotopes, scope, roles } = this;
    await nuclei.all().forEach(async nucleus => {
      const { machine, grant, type } = nucleus;
      const value = _.get(values, machine, undefined);
      const isotope = Isotope({ reactor, nucleus, value });
      if (!await grant({ isotope, scope, roles })) { return; }
      if (type === context.CONTAINER) {
        isotope.isotopes = new Isotopes({ reactor, nuclei: nucleus.nuclei, scope, roles });
        isotope.isotopes.hydrate();
      } else if (type === context.COLLECTION) {

      }
      isotopes.push(isotope);
    });
    return this;
  };
}

export default (args: IsotopesArgs) => new Isotopes(args);
