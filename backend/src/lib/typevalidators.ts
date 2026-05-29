export const isProvided = (value: unknown): boolean => value !== undefined;
export const isString = (value: unknown): value is string => typeof value === 'string';
export const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';