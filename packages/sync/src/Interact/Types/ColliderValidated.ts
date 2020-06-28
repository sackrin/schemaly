import { ValidatorResult } from '../../Validate/Types';

type ColliderValidated = {
  valid: boolean;
  results: { [s: string]: ValidatorResult };
  flatten: () => {
    [key: string]: ValidatorResult | { [s: string]: ValidatorResult };
  };
};

export default ColliderValidated;
