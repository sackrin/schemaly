export class Atom {
  machine

  static create (machine) {
    return new Atom(machine)
  }

  constructor (machine) {
    this.machine = machine
  }
}
