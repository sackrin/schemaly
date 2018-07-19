import { Blueprints } from "../../Blueprint/Types/Blueprints";
import { RolesType, ScopesType } from "../../Policy/Types";

export interface Model {
  machine: string;
  label?: string;
  blueprints: Blueprints;
  roles: RolesType;
  scope: ScopesType;
  options: any;
}

export default Model;
