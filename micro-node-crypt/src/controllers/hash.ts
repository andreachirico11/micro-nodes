import { RequestHandler } from 'express';
import { ServerErrorResp, SuccessResponse } from '../types/ApiResponses';
import { log_info } from '../utils/log';
import { CompareReq, HashReq } from '../types/RequestTypes';
import { INTERNAL_SERVER } from '../types/ErrorCodes';
import {hasher, comparer } from '../utils/hashingFunctions';


export const hash: RequestHandler = ({body: {input}}: HashReq, res) => {
  try {
    log_info("Start Hashing process");
    const hashResult = hasher(input);
    log_info("Hashed Successfully");
    return  new SuccessResponse(res, {hashResult});
  } catch (error) {
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
}

export const compare: RequestHandler = ({body: {compareWith, hash}}: CompareReq, res) => {
  try {
    log_info("Start Comparing process");
    const compareResult = comparer(hash, compareWith);
    log_info("Compared Successfully");
    return  new SuccessResponse(res, {compareResult});
  } catch (error) {
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
}





