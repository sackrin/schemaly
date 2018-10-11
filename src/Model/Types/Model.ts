import { Blueprints } from "../../Blueprint/Types/Blueprints";
import { RolesType, ScopesType } from "../../Policy/Types";
import { Options } from '../../Common';
import { Context } from '../../Blueprint';

export interface Model {
  machine: string;
  label?: string;
  context?: Context;
  blueprints: Blueprints;
  roles: RolesType;
  scope: ScopesType;
  options: Options;
}

export default Model;
