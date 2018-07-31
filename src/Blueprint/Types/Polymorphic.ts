import Variation from "./Variation";
import Blueprints from "./Blueprints";
import { Blueprint } from "./index";

interface Polymorphic {
  parent?: Blueprint;
  variations: Variation[];
  options: any;
  variation({ blueprints, matchers }: Variation): this;
  setParent(parent: Blueprint): void;
  resolve(values: any): Blueprints;
}

export default Polymorphic;
