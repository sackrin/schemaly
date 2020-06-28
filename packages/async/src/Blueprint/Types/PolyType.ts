import { Blueprints } from './Blueprints';

interface PolyType {
  machine: string;
  blueprints: Blueprints;
  matchers: Object | Function;
  options?: { [k: string]: any };
}

export default PolyType;
