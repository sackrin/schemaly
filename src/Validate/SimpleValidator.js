import { buildRules } from './utils';

export class SimpleValidator {
  config

  options

  constructor ({ rules = ['required'], options = {} }) {
    this.config = { rules };
    this.options = { ...options };
    this.getRules = this.getRules.bind(this);
  }

  async getRules ({ options = {} } = {}) {
    return buildRules(this.config.rules, { validator: this.options, ...options })
      .then(builtRules => (builtRules.join('|')));
  }

  async validate ({ value }) {
    return { result: true, messages: [] };
  }
}
