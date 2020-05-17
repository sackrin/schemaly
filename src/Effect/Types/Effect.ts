import { Collider } from "../../Interact/Types";
import { Blueprint } from "../../Blueprint/Types";
import { Effects } from "./";
import { ValidatorResult } from "../../Validate/Types";
import { Context } from "../../Blueprint/Context/Types";

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
  getValue(options?: any): Promise<any>;
  setValue({ value, options }: { value: any; options?: any }): Promise<any>;
  find(criteria: Object | Function): Effect | undefined;
  filter(criteria: Object | Function): Effect[];
  grant(options?: any): Promise<boolean>;
  presence(options?: any): Promise<boolean>;
  hydrate(options?: any): Promise<void>;
  sanitize(options?: any): Promise<void>;
  validate(options?: any): Promise<ValidatorResult>;
  dump(options?: any): Promise<any>;
}

export default Effect;
