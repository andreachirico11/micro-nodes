import { HashHelper } from '../configs/HashHelper';
import { isHashErrorResponse } from '../helpers/MIcroHashHelper';

const callMicroHash = async (stringToHash: string) => {
  const hashResp = await HashHelper.hashString(stringToHash);
  if (isHashErrorResponse(hashResp)) {
    throw new Error('Micro Hash Helper: ' + hashResp.errors[0]);
  }
  return hashResp.payload.hashResult;
};

export default callMicroHash;
