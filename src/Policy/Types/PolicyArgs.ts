import RoleType from "./RoleType";
import ScopeType from "./ScopeType";
import RolesType from "./RolesType";
import ScopesType from "./ScopesType";

export interface PolicyArgs {
  roles: RoleType | RolesType;
  scope: ScopeType | ScopesType;
  options?: any;
}

export default PolicyArgs;
