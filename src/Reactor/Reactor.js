import { Atom } from '../Atom';

export class Reactor {
  atom: Atom;

  roles: Array<string | Function>;

  scope: Array<string | Function>;

  options: Object;

  constructor ({ atom, roles, scope, ...options }: { atom: Atom, roles: Array<string | Function>, scope: Array<string | Function> }) {
    this.atom = atom;
    this.roles = roles;
    this.scope = scope;
    this.options = options;
  }
}
