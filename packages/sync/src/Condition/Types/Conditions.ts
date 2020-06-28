import Condition from './Condition';
import { Options } from '../../Common';
import { Collider } from '../../Interact/Types';
import { Blueprint } from '../../Blueprint/Types';
import { Effect } from '../../Effect/Types';

export interface Conditions {
  conditions: Condition[];
  options: Options;
  check({
    collider,
    blueprint,
    hydrate,
    ...options
  }: {
    collider: Collider;
    blueprint: Blueprint;
    hydrate: Effect;
    options?: any;
  }): boolean;
}

export default Conditions;
