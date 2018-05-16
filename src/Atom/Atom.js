import { NucleusGroup } from '../Nucleus/NucleusGroup';

export class Atom {
  config: Object;

  nuclei: NucleusGroup;

  options: Object;

  constructor ({ machine, label, nuclei, ...options }: { machine: string, nuclei: NucleusGroup, label?: string }) {
    this.config = { machine, label };
    this.nuclei = nuclei;
    this.options = options;
  }
}
