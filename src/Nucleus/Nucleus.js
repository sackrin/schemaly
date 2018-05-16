import { NucleusGroup } from './NucleusGroup';
import type { NucleusContext } from './context';

export class Nucleus {
  config: {
    type: NucleusContext,
    machine: string,
    label:string
  };

  options: Object;

  policies: Object;

  sanitizers: Object;

  validators: Object;

  parent: Object;

  nuclei: NucleusGroup;

  constructor ({ type, machine, label, parent, policies, sanitizers, validators, ...options }: NucleusArgs) {
    this.config = { type, machine, label };
    if (parent) this.parent = parent;
    if (policies) this.policies = policies;
    if (sanitizers) this.sanitizers = sanitizers;
    if (validators) this.validators = validators;
    if (options) this.options = { ...options };
  }

  addNuclei ({ nuclei }: { nuclei: NucleusGroup}) {
    if (!this.config.type.children && !this.config.type.repeater) { throw new Error('CANNOT_HAVE_CHILDREN'); }
    nuclei.parent = this;
    this.nuclei = nuclei;
  }
}

export type NucleusArgs = {
  type: NucleusContext,
  machine: string,
  label: string,
  parent?: Object,
  policies?: Object,
  sanitizers?: Object,
  validators?: Object,
  options?: Object
};
