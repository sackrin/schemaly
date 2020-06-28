import { Collider } from '../../Interact/Types';
import { Blueprint } from '../../Blueprint/Types';
import { Effects } from './index';
import { ValidatorResult } from '../../Validate/Types';
import { Context } from '../../Blueprint/Context/Types';

export interface Effect {
  collider: Collider;
  blueprint: Blueprint;
  parent?: Effects;
  value: any;
  children: Effects[];
  options: any;
  machine: string;
  context: Context;
  description?: string;
  tags?: string[];
  getValue(options?: any): any;
  setValue({ value, options }: { value: any; options?: any }): any;
  find(criteria: Object | Function): Effect | undefined;
  filter(criteria: Object | Function): Effect[];
  grant(options?: any): boolean;
  presence(options?: any): boolean;
  hydrate(options?: any): void;
  refine(options?: any): void;
  sanitize(options?: any): void;
  validate(options?: any): ValidatorResult;
  dump(options?: any): any;
}

export default Effect;
