import { RolesType, ScopesType } from "../../Policy/Types";
import { Model } from "../../Model/Types";

interface ColliderArgs {
  model: Model;
  roles: RolesType;
  scope: ScopesType;
  options?: any;
}

export default ColliderArgs;
