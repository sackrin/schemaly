export const intFilter = (value: any) =>
  value !== undefined ? parseInt(value, 10) : undefined;

export default intFilter;
