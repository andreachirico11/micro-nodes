import { RequestHandler } from 'express';
import { SuccessResponse } from '../types/ApiResponses';
import { log_info } from '../utils/log';
import { API_KEY_CHARS, API_KEY_DEFAULT_LENGTH } from '../configs/Envs';
import getKey from '../utils/apiKeyGenerator';

export const getApiKey: RequestHandler = (req, res) => {
  log_info("Generating api key of " + API_KEY_DEFAULT_LENGTH + " charachters chosen between\n <<<  " + API_KEY_CHARS + "   >>>")
  const key = getKey(API_KEY_DEFAULT_LENGTH, API_KEY_CHARS);
  log_info("Generated Key: ")
  log_info(key);
  return new SuccessResponse(res, {key});
};
