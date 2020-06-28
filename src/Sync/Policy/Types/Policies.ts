import { Policy } from './';
import PolicyGrantArgs from './PolicyGrantArgs';
import { Options } from '../../Common';

export interface Policies {
  policies: Policy[];
  options: Options;
  grant({ roles, scope, ...options }: PolicyGrantArgs): boolean;
}

export default Policies;
