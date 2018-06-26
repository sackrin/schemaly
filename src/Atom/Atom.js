import { Nuclei } from '../Nucleus/Nuclei';

export type AtomArgs = {
  machine: string,
  nuclei: Nuclei,
  roles: Array<string | Function>,
  scope: Array<string | Function>,
  label?: string
};

export class Atom {
  config: Object;

  nuclei: Nuclei;

  roles: Array<string | Function>;

  scope: Array<string | Function>;

  options: Object;

  constructor ({ machine, roles, scope, label, nuclei, ...options }: AtomArgs) {
    this.config = { machine, label };
    this.nuclei = nuclei;
    this.roles = roles;
    this.scope = scope;
    this.options = options;
  }
}

export default (args: AtomArgs): Atom => (new Atom(args));
