import { Collider } from '../../Interact/Types';
import { Blueprints } from '../../Blueprint/Types';
import { Effect } from './index';
import { ValidatorResult } from '../../Validate/Types';

export interface Effects {
  collider: Collider;
  blueprints: Blueprints;
  values: any;
  parent: Effect | Collider;
  effects: Effect[];
  options?: any;
  find(criteria: Function | Object): Effect;
  filter(criteria: Function | Object): Effect[];
  hydrate(options: any): void;
  refine(options: any): void;
  validate(options: any): { [s: string]: ValidatorResult };
  sanitize(options: any): void;
  dump(options: any): any;
}

export default Effects;
