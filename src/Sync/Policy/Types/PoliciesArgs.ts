import { Policy } from './';
import { Options } from '../../Common/Types';

export interface PoliciesArgs {
  policies: Policy[];
  options?: Options;
}

export default PoliciesArgs;
