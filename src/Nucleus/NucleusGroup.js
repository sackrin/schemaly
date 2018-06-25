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

  all = (): Array<Nucleus> => (this.nuclei);
}

export default (nuclei: Array<Nucleus>, options: Object = {}): NucleusGroup => (new NucleusGroup({ nuclei, ...options }));
