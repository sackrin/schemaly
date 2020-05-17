import ChecksType from './ChecksType';
import { Collider } from '../../Interact/Types';
import { Blueprint } from '../../Blueprint/Types';
import { Effect } from '../../Effect/Types';

export interface Condition {
  checks: ChecksType;
  options: Object;
  verify(): void;
  check({
    collider,
    blueprint,
    hydrate,
    ...options
  }: {
    collider: Collider;
    blueprint: Blueprint;
    hydrate: Effect;
    options: any;
  }): Promise<boolean>;
}

export default Condition;
