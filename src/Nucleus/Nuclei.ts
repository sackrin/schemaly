export class Nuclei {
  nuclei;

  parent;

  options;

  constructor ({ nuclei, parent, ...options }) {
    if (parent) this.parent = parent;
    this.nuclei = nuclei;
    this.options = options;
  }

  all = () => (this.nuclei);
}

export default (nuclei, options = {}) => (new Nuclei({ nuclei, ...options }));
