import { Blueprints } from '../../Blueprint/Types/Blueprints';
import { RolesType, RoleType, ScopesType, ScopeType } from '../../Policy/Types';
import { Options } from '../../Common';
import { Context } from '../../Blueprint';
import { Collider } from '../../Interact/Types';
import { ValidatorResult } from '../../Validate/Types';

export interface Model {
  machine: string;
  label?: string;
  context?: Context;
  blueprints: Blueprints;
  roles: RolesType;
  scope: ScopesType;
  options: Options;
  collide({
    roles,
    scope,
    options
  }: {
    roles: RoleType[];
    scope: ScopeType[];
    options?: Options;
  }): Collider;
  handle({
    roles,
    scope,
    values,
    options
  }: {
    roles: RoleType[];
    scope: ScopeType[];
    values: any;
    options: Options;
  }): Promise<{ [k: string]: any } | ValidatorResult>;
}

export default Model;
