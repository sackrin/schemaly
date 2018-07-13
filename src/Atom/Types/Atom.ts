import { Nuclei } from "../../Nucleus/Types/Nuclei";
import { RolesType, ScopesType } from "../../Policy/Types";

export interface Atom {
  machine: string;
  label?: string;
  nuclei: Nuclei;
  roles: RolesType;
  scope: ScopesType;
  options: any;
}

export default Atom;
