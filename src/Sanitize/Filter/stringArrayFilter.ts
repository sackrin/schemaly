import stringFilter from './stringFilter';

export const stringArrayFilter = (value: any) =>
  Array.isArray(value)
    ? value.map((valueItem) => stringFilter(valueItem))
    : undefined;

export default stringArrayFilter;
