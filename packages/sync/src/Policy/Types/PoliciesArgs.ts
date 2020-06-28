import { Policy } from './index';
import { Options } from '../../Common/Types';

export interface PoliciesArgs {
  policies: Policy[];
  options?: Options;
}

export default PoliciesArgs;
