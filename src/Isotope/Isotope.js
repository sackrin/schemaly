import { Nucleus } from '../Nucleus';
import { Reactor } from '../Reactor';

export class Isotope {
  reactor: Reactor;

  nucleus: Nucleus;

  value: any;

  options: Object;

  constructor ({ reactor, nucleus, value, ...options }: { reactor: Reactor, nucleus: Nucleus, value: any }) {
    this.reactor = reactor;
    this.nucleus = nucleus;
    this.value = value;
    this.options = options;
  }
}
