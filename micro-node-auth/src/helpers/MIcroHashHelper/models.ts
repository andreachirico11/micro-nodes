import { ErrorCodes } from "./ErrorCodes";

export interface HashBody {
    input: string
  }

  export interface HashBody {
    input: string
  }

export interface CompareBody {hash: string, compareWith: string};

  
  export interface HashResponse {
    success: true;
    payload: {
      hashResult: string;
    };
  }

  export interface ApiKeyResponse {
    success: true;
    payload: {
      key: string;
    };
  }
  
  export interface HashCompareResponse {
    success: true;
    payload: {
      compareResult: boolean;
    };
  }

  export interface HashErrorResponse {
    errCode: ErrorCodes;
    errors: [string];
    success: false;
  }
  
  export function isHashErrorResponse(r: HashResponse | HashErrorResponse | HashCompareResponse | ApiKeyResponse): r is HashErrorResponse {
      return !r.success;
  }
  