import { Blueprints } from "../../Blueprint/Types/Blueprints";
import { RolesType, ScopesType } from "../../Policy/Types";

interface ModelArgs {
  machine: string;
  label?: string;
  blueprints: Blueprints;
  roles: RolesType;
  scope: ScopesType;
  options?: any;
}

export default ModelArgs;
