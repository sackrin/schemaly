import { RolesType, ScopesType } from "../../Policy/Types";
import { Model } from "../../Model/Types";
import { Effects } from "../../Effect/Types";
import { ValidatorResult } from "../../Validate/Types";

export interface Collider {
  model: Model;
  scope: ScopesType;
  roles: RolesType;
  effects?: Effects;
  values?: any;
  options?: any;
  with(values: any): this;
  and({ values, ids }: { values: any; ids?: string[] }): this;
  collide(options?: any): Promise<this>;
  sanitize(options: any): Promise<this>;
  validate(
    options: any
  ): Promise<{ valid: boolean; results: { [s: string]: ValidatorResult } }>;
  dump(options: any): Promise<any>;
}

export default Collider;
