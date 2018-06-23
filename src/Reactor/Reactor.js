import { Atom } from '../Atom';
import { Isotopes } from '../Isotope';

export type ReactorArgs = {
  atom: Atom,
  roles: Array<string | Function>,
  scope: Array<string | Function>
};

export class Reactor {
  atom: Atom;

  roles: Array<string | Function>;

  scope: Array<string | Function>;

  options: Object;

  constructor ({ atom, roles, scope, ...options }: ReactorArgs) {
    this.atom = atom;
    this.roles = roles;
    this.scope = scope;
    this.options = options;
  }

  with = async ({ values, ...options }: { values: Object }) => {
    const { atom, roles, scope } = this;
    return Isotopes({ nuclei: atom.nuclei, scope, roles, options });
  };
}

export default (args: ReactorArgs): Reactor => (new Reactor(args));
