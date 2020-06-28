import { PolicyGrantArgs, RolesType, ScopesType } from './index';
import { Options } from '../../Common';

export interface Policy {
  roles: RolesType;
  scope: ScopesType;
  options: Object;
  verify(): void;
  getRoles(options: Options): string[];
  getScope(options: Options): string[];
  grant({ roles, scope, options }: PolicyGrantArgs): boolean;
}

export default Policy;
