import { PolicyGrantArgs, RolesType, ScopesType } from "./types";
export interface PolicyInterface {
    roles: RolesType;
    scope: ScopesType;
    options: Object;
    getRoles(options: Object): Promise<string[]>;
    getScope(options: Object): Promise<string[]>;
    grant({ isotope, roles, scope, options }: PolicyGrantArgs): Promise<boolean>;
}
