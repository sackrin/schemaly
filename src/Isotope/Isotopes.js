import { NucleusGroup } from '../Nucleus';
import { Reactor } from '../Reactor';

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

  roles: Array<string | Function>;

  scope: Array<string | Function>;

  options: Object;

  constructor ({ reactor, nuclei, scope, roles, ...options }: IsotopesArgs) {
    this.reactor = reactor;
    this.nuclei = nuclei;
    this.scope = scope;
    this.roles = roles;
    this.options = options;
  }
}

export default (args: IsotopesArgs) => new Isotopes(args);
