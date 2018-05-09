import { Nucleus } from './Nucleus';

export class NucleusGroup {
  nuclei: NucleusGroup | any;

  parent: Nucleus;

  constructor ({ nuclei = [] }: { nuclei: Array<Nucleus> }) {
    this.nuclei = nuclei;
  }
}
