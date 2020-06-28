import RoleType from './RoleType';
import RolesType from './RolesType';
import ScopeType from './ScopeType';
import ScopesType from './ScopesType';
import { Options } from '../../Common';

export interface PolicyGrantArgs {
  roles: RoleType | RolesType;
  scope: ScopeType | ScopesType;
  options?: Options;
}

export default PolicyGrantArgs;
