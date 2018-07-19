import { BlueprintsType, Blueprint } from "./";

export interface Blueprints {
  blueprints: BlueprintsType;
  parent?: Blueprint;
  options: any;
  setParent(parent: Blueprint): void;
  all(): BlueprintsType;
}

export default Blueprints;
