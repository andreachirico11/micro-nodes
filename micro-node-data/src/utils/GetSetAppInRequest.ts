import { Request } from 'express';
import { CollectionConfig } from '../models/collectionConfig';
import { GetSetRequestPropsBase } from 'micro-nodes-shared';

const ACTUAL_TABLE = 'ACTUAL_TABLE';

export class GetSetRequestProps extends GetSetRequestPropsBase {
  static getTableModel(req: Request) {
    return req[ACTUAL_TABLE] as CollectionConfig;
  }

  static setTableModel(req: Request, t: CollectionConfig) {
    req[ACTUAL_TABLE] = t;
  }
}
