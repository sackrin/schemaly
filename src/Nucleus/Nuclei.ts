import { NucleiArgs, NucleiType } from "./Types";

export class Nuclei {
  public nuclei: NucleiType = [];

  public options: any = {};

  constructor ({ nuclei, options = {} }: NucleiArgs) {
    this.nuclei = nuclei;
    this.options = options;
  }

  public all = () => (this.nuclei);
}

export default (nuclei:NucleiType, options: any = {}) => (new Nuclei({ nuclei, options }));
