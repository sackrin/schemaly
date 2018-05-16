import { Nucleus } from './Nucleus';

export class NucleusGroup {
  nuclei: Array<Nucleus>;

  parent: Nucleus;

  constructor ({ nuclei = [] }: { nuclei: Array<Nucleus> }) {
    this.nuclei = nuclei;
  }
}
