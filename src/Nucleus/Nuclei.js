import { Nucleus } from './Nucleus';

export type NucleiArgs = {
  nuclei: Array<Nucleus>,
  parent?: Nucleus
};

export class Nuclei {
  nuclei: Array<Nucleus>;

  parent: Nucleus;

  options: Object;

  constructor ({ nuclei, parent, ...options }: NucleiArgs) {
    if (parent) this.parent = parent;
    this.nuclei = nuclei;
    this.options = options;
  }

  all = (): Array<Nucleus> => (this.nuclei);
}

export default (nuclei: Array<Nucleus>, options: Object = {}): Nuclei => (new Nuclei({ nuclei, ...options }));
