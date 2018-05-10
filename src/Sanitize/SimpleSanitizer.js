import { buildRules } from './utils';
import type { BuiltRules } from './utils';

export class SimpleSanitizer {
  config: { rules: Array<string | Function> };

  options: Object;

  constructor ({ rules, ...options }: { rules: Array<string | Function> }) {
    this.config = { rules };
    this.options = options;
  }

  async getRules ({ ...options }: Object = {}): Promise<string> {
    return buildRules(this.config.rules, { validator: this.options, ...options })
      .then((builtRules: BuiltRules): string => (builtRules.join('|')));
  }
}
