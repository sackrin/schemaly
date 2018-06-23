import { Atom } from '../Atom';

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
}

export default (args: ReactorArgs): Reactor => (new Reactor(args));
