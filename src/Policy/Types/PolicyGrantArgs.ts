import RoleType from "./RoleType";
import RolesType from "./RolesType";
import ScopeType from "./ScopeType";
import ScopesType from "./ScopesType";
import {Isotope} from "../../Isotope/Types";

export interface PolicyGrantArgs {
  isotope: Isotope;
  roles: RoleType | RolesType;
  scope: ScopeType | ScopesType;
  options?: any;
}

export default PolicyGrantArgs;
