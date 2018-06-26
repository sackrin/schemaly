import _ from 'lodash';
import { Atom } from '../Atom';
import { Isotopes } from '../Isotope';
import { buildRoles, buildScope } from '../Policy/utils';

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
    const rolesDiff = await _.difference(await buildRoles(atom.roles), await buildRoles(roles));
    if (rolesDiff.length > 0) throw new Error('REACTOR_INVALID_ROLES');
    const scopeDiff = await _.difference(await buildScope(atom.scope), await buildScope(scope));
    console.log(scopeDiff);
    if (scopeDiff.length > 0) throw new Error('REACTOR_INVALID_SCOPE');
    return Isotopes({ reactor: this, nuclei: atom.nuclei, scope, roles, options });
  };
}

export default (args: ReactorArgs): Reactor => (new Reactor(args));
