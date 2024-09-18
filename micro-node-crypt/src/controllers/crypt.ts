import { RequestHandler } from 'express';
import { BadDecrypt, ServerErrorResp, SuccessResponse } from '../types/ApiResponses';
import { log_error, log_info } from '../utils/log';
import { CryptReq } from '../types/RequestTypes';
import { cypher, decypher as decrpyter } from '../utils/cryptFunctions';
import { INTERNAL_SERVER } from '../types/ErrorCodes';

const sharedMiddleware = (type: 'crypt' | 'decrypt') => {
  const reqHandler: RequestHandler = ({ body: { input, secretKey } }: CryptReq, res) => {
    try {
      log_info(
        `Start ${
          type === 'crypt' ? 'crypting' : 'decrypting'
        } String: ${input} with secret: ${secretKey}`
      );
      const output =
        type === 'crypt'
          ? {
              crypted: cypher(input, secretKey),
            }
          : {
              decrypted: decrpyter(input, secretKey),
            };
      log_info(`${type === 'crypt' ? 'Crypted' : 'Decrypted'} Successfully`);
      return new SuccessResponse(res, output);
    } catch (error) {
      log_error(error, `Error ${type === 'crypt' ? 'crypting' : 'decrypting'}`);
      if (error['code'] === 'ERR_OSSL_BAD_DECRYPT') {
        return new BadDecrypt(res, ["Input or Secret are Wrong"]);
      }
      return new ServerErrorResp(res, INTERNAL_SERVER);
    }
  };
  return reqHandler;
};

export const crypt: RequestHandler = sharedMiddleware('crypt');

export const decrypt: RequestHandler = sharedMiddleware('decrypt');
