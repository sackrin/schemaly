import { Nuclei } from "../../Nucleus/Types/Nuclei";
import { RolesType, ScopesType } from "../../Policy/Types";

interface AtomArgs {
  machine: string;
  label?: string;
  nuclei: Nuclei;
  roles: RolesType;
  scope: ScopesType;
  options?: any;
}

export default AtomArgs;
