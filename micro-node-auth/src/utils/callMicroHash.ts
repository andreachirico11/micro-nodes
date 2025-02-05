import { HashHelper } from '../configs/HashHelper';
import { isHashErrorResponse } from 'micro-nodes-shared';

const callMicroHash = async (stringToHash: string) => {
  const hashResp = await HashHelper.hashString(stringToHash);
  if (isHashErrorResponse(hashResp)) {
    throw new Error('Micro Hash Helper: ' + hashResp.errors[0]);
  }
  return hashResp.payload.hashResult;
};

export default callMicroHash;
