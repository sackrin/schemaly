import { Blueprints } from "./Blueprints";

interface Variation {
  blueprints: Blueprints;
  matchers: Object | Function;
}

export default Variation;
