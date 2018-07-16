import { Nuclei, Nucleus, NucleiArgs, NucleiType } from "./Types";

/**
 * FIELDS NUCLEI
 * Contains multiple Field instances
 */
export class Fields implements Nuclei {
  public nuclei: NucleiType = [];

  public parent?: Nucleus;

  public options: any = {};

  /**
   * @param {NucleiType} nuclei
   * @param {Nucleus} parent
   * @param {any} options
   */
  constructor({ nuclei, parent, options = {} }: NucleiArgs) {
    this.nuclei = nuclei;
    this.parent = parent;
    this.options = options;
  }

  public setParent = (parent: Nucleus): void => {
    this.parent = parent;
  };

  public all = (): NucleiType => this.nuclei;
}

/**
 * FACTORY CALLBACK
 * This is the typical way to create a new fields instance.
 * Should be used in favour of using the primary fields class
 * @param {NucleiType} nuclei
 * @param args
 * @returns {Fields}
 */
export default (nuclei: NucleiType, args: any = {}) =>
  new Fields({ nuclei, ...args });
