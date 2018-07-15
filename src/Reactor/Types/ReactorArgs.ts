import {RolesType, ScopesType} from "../../Policy/Types";
import {Atom} from "../../Atom/Types";

interface ReactorArgs {
  atom: Atom;
  roles: RolesType;
  scope: ScopesType;
  options?: any;
}

export default ReactorArgs;
