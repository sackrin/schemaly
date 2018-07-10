export class Isotope {
  constructor(public options: any) {}
}

export default (args: any) => (new Isotope(args));
