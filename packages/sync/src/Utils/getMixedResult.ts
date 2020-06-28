import _ from 'lodash';

export function getMixedResult(values: any[], options: any = {}): any[] {
  return values.reduce((collect: any, value: any) => {
    const built: any[] = collect;
    return !_.isFunction(value)
      ? [...built, value]
      : [...built, ...value(options)];
  }, []);
}

export default getMixedResult;
