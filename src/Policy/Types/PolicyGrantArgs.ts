import RoleType from "./RoleType";
import RolesType from "./RolesType";
import ScopeType from "./ScopeType";
import ScopesType from "./ScopesType";
import { Effect } from "../../Effect/Types";

export interface PolicyGrantArgs {
  effect: Effect;
  roles: RoleType | RolesType;
  scope: ScopeType | ScopesType;
  options?: any;
}

export default PolicyGrantArgs;
