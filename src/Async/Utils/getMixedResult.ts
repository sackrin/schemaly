import _ from "lodash";

export async function getMixedResult(
  values: any[],
  options: any = {}
): Promise<any[]> {
  return values.reduce(async (collect: Promise<any>, value: any) => {
    const built: any[] = await collect;
    return !_.isFunction(value)
      ? [...built, value]
      : [...built, ...(await value(options))];
  }, Promise.all([]));
}

export default getMixedResult;
