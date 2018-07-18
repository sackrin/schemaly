import { NucleiType, Nucleus } from "./";

export interface Nuclei {
  nuclei: NucleiType;
  parent?: Nucleus;
  options: any;
  setParent(parent: Nucleus): void;
  all(): NucleiType;
}

export default Nuclei;
