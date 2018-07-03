import _ from 'lodash';

export class Nucleus {
  config = {};

  parent;

  nuclei;

  options = {};

  policies;

  sanitizers;

  validators;

  setters;

  getters;

  constructor ({ type, machine, label, parent, nuclei, getters, setters, policies, sanitizers, validators, ...options }) {
    this.config = { type, machine, label };
    if (parent) this.parent = parent;
    if (policies) this.policies = policies;
    if (sanitizers) this.sanitizers = sanitizers;
    if (validators) this.validators = validators;
    if (getters) this.getters = getters;
    if (setters) this.setters = setters;
    if (nuclei) this.addNuclei({ nuclei: nuclei });
    this.options = { ...options };
  }

  get machine () { return this.config.machine; }

  get type () { return this.config.type; }

  get label () { return this.config.label; }

  addNuclei = ({ nuclei }) => {
    if (!this.config.type.children && !this.config.type.repeater) {
      throw new Error('CANNOT_HAVE_CHILDREN');
    }
    nuclei.parent = this;
    this.nuclei = nuclei;
  };

  grant = async ({ isotope, scope, roles, ...options }) => {
    const { policies } = this;
    if (!policies) return true;
    return policies.grant({ isotope, scope, roles, ...options });
  };

  validate = async ({ value, isotope, ...options }) => {
    const { validators } = this;
    return validators ? validators.validate({ value, isotope, ...options }) : { valid: true, messages: [], children: [] };
  };

  sanitize = async ({ isotope, ...options }) => {
    const { sanitizers } = this;
    return sanitizers ? sanitizers.filter({ value: isotope.value, isotope, ...options }) : isotope.value;
  };

  getter = async ({ value, isotope, ...options } = {}) => {
    return _.reduce(this.getters, async (value, getter) => (getter({ isotope, value, options })), value);
  };

  setter = async ({ value, isotope, ...options }) => {
    return _.reduce(this.setters, async (value, setter) => (setter({ isotope, value, options })), value);
  };
}

export default (args) => (new Nucleus(args));
