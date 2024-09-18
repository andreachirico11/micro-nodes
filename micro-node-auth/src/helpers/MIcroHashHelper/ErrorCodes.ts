export const GENERIC = 'MNA_1';
export const UNSUPPORTED_URL = 'MNA_2';
export const VALIDATION = 'MNA_3';
export const INTERNAL_SERVER = 'MNA_4';
export const NON_EXISTENT = 'MNA_5';

export type ErrorCodes =
  | typeof GENERIC
  | typeof UNSUPPORTED_URL
  | typeof VALIDATION
  | typeof INTERNAL_SERVER
  | typeof NON_EXISTENT;
