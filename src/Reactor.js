export class Reactor {
  atom

  values = []

  static using (atom) {
    return new Reactor(atom)
  }

  constructor (atom) {
    this.atom = atom
    this.values = []
  }
}
