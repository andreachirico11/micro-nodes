import { Request } from 'express';

export type HeaderApiKey = { api_key: string };
export type HeaderAuthorization = { authorization: string };

export type SingleFileBody = {
  subPath?: string;
};
interface ProtectedRequest<TParams, Tbody, Tbody2>
  extends Request<TParams, Tbody, Tbody2> {
  headers: HeaderApiKey & HeaderAuthorization;
}

export interface StoreRequest extends ProtectedRequest<{}, {}, SingleFileBody> {}

export type GetFileRequest = ProtectedRequest<{fileId: string}, {}, any>;

export type AllProtectedRequests = StoreRequest | GetFileRequest;