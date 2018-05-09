import { SingleGrantPolicyGroup } from '../Policy';

export class Nucleus {
  config;

  options;

  policies;

  parent;

  nuclei;

  constructor ({ type, machine, label, parent, policies = new SingleGrantPolicyGroup([]), options = {} }, nuclei) {
    this.config = { type, machine, label };
    this.parent = parent;
    this.policies = policies;
    this.options = { ...options };
    if (nuclei) {
      this.addNuclei(nuclei);
    }
  }

  addNuclei (group) {
    group.parent = this;
    this.nuclei = group;
  }
}
