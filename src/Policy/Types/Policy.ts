import { PolicyGrantArgs, RolesType, ScopesType } from "./index";

export interface Policy {
  roles: RolesType;
  scope: ScopesType;
  options: Object;
  getRoles(options: Object): Promise<string []>;
  getScope(options: Object): Promise<string []>;
  grant({ isotope, roles, scope, options }: PolicyGrantArgs): Promise<boolean>;
}

export default Policy;
