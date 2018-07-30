import Variation from "./Variation";

interface Polymorphic {
  variations: Variation[];
  options: any;
  variation({ blueprints, matchers }: Variation): this ;
}

export default Polymorphic;
