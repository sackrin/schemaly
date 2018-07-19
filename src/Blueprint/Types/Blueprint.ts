import { Context } from "../Context/Types";
import { Policies } from "../../Policy/Types";
import { SanitizerApplyArgs, Sanitizers } from "../../Sanitize/Types";
import { PolicyGrantArgs } from "../../Policy";
import {
  ValidatorResult,
  Validators,
  ValidatorValidateArgs
} from "../../Validate/Types";
import { Blueprints } from "./";
import { Effect } from "../../Effect/Types";

export interface Blueprint {
  context: Context;
  machine: string;
  label?: string;
  parent?: Blueprint;
  blueprints: Blueprints;
  options: any;
  policies: Policies;
  sanitizers: Sanitizers;
  validators: Validators;
  setters: Function[];
  getters: Function[];
  setBlueprints(blueprints?: Blueprints): void;
  setSanitizers(sanitizers?: Sanitizers): void;
  setValidators(validators?: Validators): void;
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
