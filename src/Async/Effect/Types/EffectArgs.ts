import { Collider } from "../../Interact/Types";
import { Blueprint } from "../../Blueprint/Types";
import { Effects } from "./index";

export interface EffectArgs {
  collider: Collider;
  blueprint: Blueprint;
  parent?: Effects;
  value: any;
  options?: any;
}

export default EffectArgs;
