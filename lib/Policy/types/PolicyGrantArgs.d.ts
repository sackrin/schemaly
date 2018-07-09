import { Isotope } from "../../Isotope/Isotope";
import RoleType from "./RoleType";
import RolesType from "./RolesType";
import ScopeType from "./ScopeType";
import ScopesType from "./ScopesType";
export declare type PolicyGrantArgs = {
    isotope: Isotope;
    roles: RoleType | RolesType;
    scope: ScopeType | ScopesType;
    options?: any;
};
export default PolicyGrantArgs;
