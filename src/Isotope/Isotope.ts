interface IsotopeArgs {
  value: any;
}

export class Isotope {
  public value: any;

  constructor({ value }: IsotopeArgs) {
    this.value = value;
  }

  public getValue = async (): Promise<any> => (this.value);
}

export default (args: IsotopeArgs) => (new Isotope(args));
