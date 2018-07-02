import { Atom } from '../Atom';
import { Isotopes } from '../Isotope';
import { uniqMerge } from './utils';

export type ReactorArgs = {
  atom: Atom,
  roles: Array<string | Function>,
  scope: Array<string | Function>
};

export class Reactor {
  atom: Atom;

  roles: Array<string | Function>;

  scope: Array<string | Function>;

  isotopes: Isotopes;

  values: Object;

  options: Object;

  constructor ({ atom, roles, scope, ...options }: ReactorArgs) {
    this.atom = atom;
    this.roles = roles;
    this.scope = scope;
    this.options = options;
  }

  with = (values: Object) => {
    this.values = values;
    return this;
  };

  and = (values: Object) => {
    // this.values = uniqMerge(this.values, values);
    console.log(uniqMerge(this.values, values));
    return this;
  };

  execute = async () => {
    const { atom, values } = this;
    this.isotopes = Isotopes({
      reactor: this,
      nuclei: atom.nuclei,
      values
    });
    return this.isotopes.hydrate({ values });
  };

  sanitize = async () => {
    return this.isotopes.sanitize();
  };

  validate = async () => {
    const validated = await this.isotopes.validate();
    return {
      valid: Object.values(validated).reduce((curr, result) => (result.valid === false ? false : result.valid), true),
      results: validated
    };
  };

  dump = async () => {
    return this.isotopes.dump();
  };
}

export default (args: ReactorArgs): Reactor => (new Reactor(args));
