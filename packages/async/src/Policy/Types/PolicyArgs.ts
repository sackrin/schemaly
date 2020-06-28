import RoleType from "./RoleType";
import ScopeType from "./ScopeType";
import RolesType from "./RolesType";
import ScopesType from "./ScopesType";
import { Options } from '../../Common';

export interface PolicyArgs {
  roles: RoleType | RolesType;
  scope: ScopeType | ScopesType;
  options?: Options;
}

export default PolicyArgs;
