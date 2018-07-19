import { Collider } from "../../Interact/Types";
import { Blueprints } from "../../Blueprint/Types";
import { Effect } from "./index";
import { ValidatorResult } from "../../Validate/Types";

export interface Effects {
  collider: Collider;
  blueprints: Blueprints;
  values: any;
  parent: Effect | Collider;
  effects: Effect[];
  options?: any;
  find(criteria: Function | Object): Effect;
  filter(criteria: Function | Object): Effect[];
  hydrate(options: any): Promise<void>;
  validate(options: any): Promise<{ [s: string]: ValidatorResult }>;
  sanitize(options: any): Promise<void>;
  dump(options: any): Promise<any>;
}

export default Effects;
