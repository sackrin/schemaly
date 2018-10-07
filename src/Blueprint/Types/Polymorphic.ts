import PolyType from "./PolyType";
import Blueprints from "./Blueprints";
import { Blueprint } from "./index";

interface Polymorphic {
  parent?: Blueprint;
  types: PolyType[];
  options: any;
  type({ machine, blueprints, matchers }: PolyType): this;
  or({ machine, blueprints, matchers }: PolyType): this;
  setParent(parent: Blueprint): void;
  resolve(values: any): Blueprints;
}

export default Polymorphic;
