import { ProtectedRequest } from 'micro-nodes-shared';

export type SingleFileBody = {
  subPath?: string;
};
export interface StoreRequest extends ProtectedRequest<{}, {}, SingleFileBody> {}

export type FileIdRequest = ProtectedRequest<{fileId: string}, {}, any>;

export type AllProtectedRequests = StoreRequest | FileIdRequest;