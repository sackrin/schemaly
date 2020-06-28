import { RolesType, ScopesType } from '../../Policy/Types';
import { Model } from '../../Model/Types';
import { Effect, Effects } from '../../Effect/Types';
import { Options } from '../../Common/Types';
import ColliderValidated from './ColliderValidated';

export interface Collider {
  model: Model;
  scope: ScopesType;
  roles: RolesType;
  effects?: Effects;
  values?: any;
  options?: Options;
  with(values: any): this;
  and({ values, ids }: { values: any; ids?: string[] }): this;
  collide(options?: Options): this;
  refine(options?: Options): this;
  sanitize(options: Options): this;
  validate(options: Options): ColliderValidated;
  flatten(): { [key: string]: Effect | Effects } | void;
  dump(): any;
}

export default Collider;
