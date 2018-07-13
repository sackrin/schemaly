import {RolesType, ScopesType} from "../../Policy/Types";

export interface Reactor {
  scope: ScopesType;
  roles: RolesType;
}

export default Reactor;
