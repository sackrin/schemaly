import { Context } from "../Context/Types";
import { Policies } from "../../Policy/Types";
import { SanitizerApplyArgs, Sanitizers } from "../../Sanitize/Types";
import { PolicyGrantArgs } from "../../Policy";
import {
  ValidatorResult,
  Validators,
  ValidatorValidateArgs
} from "../../Validate/Types";
import { Blueprints, Polymorphic } from "./";
import { Effect } from "../../Effect/Types";

export interface Blueprint {
  context: Context;
  machine: string;
  label?: string;
  description?: string;
  tags?: string[];
  parent?: Blueprint;
  defaultValue?: any;
  blueprints: Blueprints | Polymorphic;
  options: any;
  policies: Policies;
  sanitizers: Sanitizers;
  validators: Validators;
  setters: Function[];
  getters: Function[];
  setBlueprints(blueprints?: Blueprints): void;
  setSanitizers(sanitizers?: Sanitizers): void;
  setValidators(validators?: Validators): void;
  getDefault(options?: any): Promise<any>;
  grant({ effect, scope, roles, options }: PolicyGrantArgs): Promise<boolean>;
  validate({
    effect,
    options
  }: ValidatorValidateArgs): Promise<ValidatorResult>;
  sanitize({ effect, options }: SanitizerApplyArgs): Promise<any>;
  applyGetters({
    effect,
    options
  }: {
    effect: Effect;
    options?: any;
  }): Promise<any>;
  applySetters({
    effect,
    options
  }: {
    effect: Effect;
    options?: any;
  }): Promise<any>;
}

export default Blueprint;
