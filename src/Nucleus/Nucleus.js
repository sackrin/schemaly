import { NucleusGroup } from './NucleusGroup';

export class Nucleus {
  config: { type:string, machine: string, label:string };

  options: Object;

  policies: Object;

  parent: Object;

  nuclei: NucleusGroup;

  constructor ({ type, machine, label, parent, policies, options = {} }: NucleusArgs) {
    this.config = { type, machine, label };
    if (parent) this.parent = parent;
    if (policies) this.policies = policies;
    if (options) this.options = { ...options };
  }

  addNuclei (group: NucleusGroup) {
    group.parent = this;
    this.nuclei = group;
  }
}

export type NucleusArgs = {
  type:string,
  machine: string,
  label:string,
  parent?: Object,
  policies?: Object,
  options?: Object
};
