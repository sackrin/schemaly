export class Atom {
  config;

  nuclei;

  roles;

  scope;

  options;

  constructor ({ machine, roles, scope, label, nuclei, ...options }) {
    this.config = { machine, label };
    this.nuclei = nuclei;
    this.roles = roles;
    this.scope = scope;
    this.options = options;
  }
}

export default (args) => (new Atom(args));
