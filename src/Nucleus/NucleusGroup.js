import { Nucleus } from './Nucleus';

export type NucleusGroupArgs = {
  nuclei: Array<Nucleus>,
  parent?: Nucleus
};

export class NucleusGroup {
  nuclei: Array<Nucleus>;

  parent: Nucleus;

  options: Object;

  constructor ({ nuclei, parent, ...options }: NucleusGroupArgs) {
    if (parent) this.parent = parent;
    this.nuclei = nuclei;
    this.options = options;
  }

  all = () => (this.nuclei);
}

export default (args: NucleusGroupArgs): NucleusGroup => (new NucleusGroup(args));
