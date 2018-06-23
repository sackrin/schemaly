import { NucleusGroup } from '../Nucleus/NucleusGroup';

export type AtomArgs = {
  machine: string,
  nuclei: NucleusGroup,
  label?: string
};

export class Atom {
  config: Object;

  nuclei: NucleusGroup;

  options: Object;

  constructor ({ machine, label, nuclei, ...options }: AtomArgs) {
    this.config = { machine, label };
    this.nuclei = nuclei;
    this.options = options;
  }
}

export default (args: AtomArgs): Atom => (new Atom(args));
