import { PolicyGrantArgs, RolesType, ScopesType } from "./index";
import { Options } from '../../Common';

export interface Policy {
  roles: RolesType;
  scope: ScopesType;
  options: Object;
  verify(): void;
  getRoles(options: Options): Promise<string[]>;
  getScope(options: Options): Promise<string[]>;
  grant({ roles, scope, options }: PolicyGrantArgs): Promise<boolean>;
}

export default Policy;
