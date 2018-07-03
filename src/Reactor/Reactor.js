import { Isotopes } from '../Isotope';
import { uniqMerge } from '../';

export class Reactor {
  atom;

  roles = [];

  scope = [];

  isotopes;

  values;

  options;

  constructor ({ atom, roles, scope, ...options }) {
    this.atom = atom;
    this.roles = roles;
    this.scope = scope;
    this.options = options;
  }

  with = ({ values }) => {
    this.values = values;
    return this;
  };

  and = ({ values, ids = [] }) => {
    this.values = uniqMerge({ ...this.values }, values, ids);
    return this;
  };

  react = async () => {
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

export default (args) => (new Reactor(args));
