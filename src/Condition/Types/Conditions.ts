import Condition from './Condition';
import { Options } from '../../Common';
import { Collider } from '../../Interact/Types';

export interface Policies {
  policies: Condition[];
  options: Options;
  check({
    collider,
    ...options
  }: {
    collider: Collider;
    options: any;
  }): Promise<boolean>;
}

export default Policies;
