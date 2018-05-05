import { PolicyGroup } from '../Policy';

export class Nucleus {
  config;

  options;

  policies;

  constructor ({ type, label, policies = new PolicyGroup([]), options = {} }) {
    this.config = { type, label };
    this.policies = policies;
    this.options = { ...options };
  }
}
