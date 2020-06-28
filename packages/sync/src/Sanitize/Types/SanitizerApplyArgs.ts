import { Effect } from '../../Effect/Types';

export interface SanitizerApplyArgs {
  value: any;
  effect: Effect;
  options?: any;
}

export default SanitizerApplyArgs;
