import { Context } from "../Context/Types";
import { Policies } from "../../Policy/Types";
import { Sanitizers } from "../../Sanitize/Types";
import { Validators } from "../../Validate/Types";
import { Blueprint, Blueprints } from "./";

export interface BlueprintArgs {
  machine: string;
  context: Context;
  label?: string;
  description?: string;
  tags?: string[];
  parent?: Blueprint;
  defaultValue?: any;
  blueprints?: Blueprints;
  getters?: Function[];
  setters?: Function[];
  policies?: Policies;
  sanitizers?: Sanitizers;
  validators?: Validators;
  options?: any;
}

export default BlueprintArgs;
