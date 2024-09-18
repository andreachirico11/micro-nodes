import { ErrorCode } from 'multer';

export const GENERIC = 'MNA_1';
export const UNSUPPORTED_URL = 'MNA_2';
export const VALIDATION = 'MNA_3';
export const INTERNAL_SERVER = 'MNA_4';
export const NON_EXISTENT = 'MNA_5';
export const UNAUTHORIZED = 'MNA_6';
export const NO_RESPONSE = 'MNA_7';
export const MISSING_PARAM = 'MNA_8';
export const ALREADY_EXISTENT = 'MNA_9';


export type ErrorCodes =
  | typeof GENERIC
  | typeof UNSUPPORTED_URL
  | typeof VALIDATION
  | typeof INTERNAL_SERVER
  | typeof UNAUTHORIZED
  | typeof NO_RESPONSE
  | typeof NON_EXISTENT
  | typeof MISSING_PARAM
  | typeof ALREADY_EXISTENT
  | ReturnType<typeof multerErrorHandling>;

export function multerErrorHandling(code: ErrorCode) {
  switch (code) {
    case 'LIMIT_FIELD_COUNT':
      return 'MULT_1';
    case 'LIMIT_FIELD_KEY':
      return 'MULT_2';
    case 'LIMIT_FIELD_VALUE':
      return 'MULT_3';
    case 'LIMIT_FILE_COUNT':
      return 'MULT_4';
    case 'LIMIT_FILE_SIZE':
      return 'MULT_5';
    case 'LIMIT_PART_COUNT':
      return 'MULT_6';
    case 'LIMIT_UNEXPECTED_FILE':
      return 'MULT_7';
    default:
      return 'MULT_0';
  }
}
