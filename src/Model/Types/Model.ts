import { Blueprints } from "../../Blueprint/Types/Blueprints";
import { RolesType, ScopesType } from "../../Policy/Types";
import { Options } from '../../Common';

export interface Model {
  machine: string;
  label?: string;
  blueprints: Blueprints;
  roles: RolesType;
  scope: ScopesType;
  options: Options;
}

export default Model;
