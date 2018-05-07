import { SingleGrantPolicyGroup } from '../Policy';

export class Nucleus {
  config;

  options;

  policies;

  constructor ({ type, label, policies = new SingleGrantPolicyGroup([]), options = {} }) {
    this.config = { type, label };
    this.policies = policies;
    this.options = { ...options };
  }
}
