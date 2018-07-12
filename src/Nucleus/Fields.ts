import { Nuclei, Nucleus, NucleiArgs, NucleiType } from "./Types";

export class Fields implements Nuclei {
  public nuclei: NucleiType = [];

  public parent?: Nucleus;

  public options: any = {};

  constructor({ nuclei, parent, options = {} }: NucleiArgs) {
    this.nuclei = nuclei;
    this.parent = parent;
    this.options = options;
  }

  public setParent = (parent: Nucleus): void => {
    this.parent = parent;
  }

  public all = (): NucleiType => (this.nuclei);
}

export default (nuclei: NucleiType, options: any = {}) => (new Fields({ nuclei, options }));
