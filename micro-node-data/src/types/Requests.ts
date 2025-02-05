import { ProtectedRequest, ProtectedRequestWithCustomQuery, ProtectedRequestWithCustomHeaders } from "micro-nodes-shared";

export type IdParams = { id: string };

export type TableNameParams = { tableName: string };

export type UncheckedOperationsQUery = {unchecked_operations: string};

export type HeaderDropColl = { drop_if_empty: string };

export type PartialBody = Omit<Object, '_id'>;

export type RequestEmpty = ProtectedRequest<TableNameParams, {}, {}>;

export type RequestWithId = ProtectedRequest<IdParams & TableNameParams, {}, any>;

export type RequestWithBody = ProtectedRequest<TableNameParams, {}, PartialBody>;

export type RequestWithBodyAndQuery = ProtectedRequestWithCustomQuery<TableNameParams, {}, PartialBody, UncheckedOperationsQUery>;

export type RequestWithBodyAndid = RequestWithId & RequestWithBody;

export type DeleteRequest = ProtectedRequestWithCustomHeaders<IdParams & TableNameParams, null, null, HeaderDropColl>;

export type AllProtectedRequests =
  | RequestEmpty
  | RequestWithId
  | RequestWithBody
  | RequestWithBodyAndid
  | DeleteRequest;
