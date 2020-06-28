import { Blueprints } from '../../Blueprint/Types/Blueprints';
import { RolesType, ScopesType } from '../../Policy/Types';
import { Options } from '../../Common';

interface ModelArgs {
  machine: string;
  label?: string;
  blueprints: Blueprints;
  roles: RolesType;
  scope: ScopesType;
  options?: Options;
}

export default ModelArgs;
