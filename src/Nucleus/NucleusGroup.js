import { Nucleus } from './Nucleus';

export class NucleusGroup {
  nuclei: Array<Nucleus>;

  parent: Nucleus;

  options: Object;

  constructor ({ nuclei, parent, ...options }: { nuclei: Array<Nucleus>, parent?: Nucleus }) {
    if (parent) this.parent = parent;
    this.nuclei = nuclei;
    this.options = options;
  }
}
