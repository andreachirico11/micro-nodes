import { getEnvs, log_info } from 'micro-nodes-shared';
import IEnvs from '../types/IEnvs';

const defaultEnvs: IEnvs = {
  PORT: 3000,
  PRODUCTION: false,
  BASE_URL: '',
  ALGORYTHM: 'aes256',
  INPUT_ENCODING: 'utf-8',
  OUTPUT_ENCODING: 'hex',
  SALT_ROUNDS: 12,
  API_KEY_CHARS: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  API_KEY_DEFAULT_LENGTH: 20
};

export const {
  PORT = defaultEnvs.PORT,
  PRODUCTION = defaultEnvs.PRODUCTION,
  BASE_URL = defaultEnvs.BASE_URL,
  ALGORYTHM = defaultEnvs.ALGORYTHM,
  INPUT_ENCODING = defaultEnvs.INPUT_ENCODING,
  OUTPUT_ENCODING = defaultEnvs.OUTPUT_ENCODING,
  SALT_ROUNDS = defaultEnvs.SALT_ROUNDS,
  API_KEY_CHARS = defaultEnvs.API_KEY_CHARS,
  API_KEY_DEFAULT_LENGTH = defaultEnvs.API_KEY_DEFAULT_LENGTH,
} = getEnvs<IEnvs>('MICRO_CRYPT_');

log_info(
  {
    PORT,
    PRODUCTION,
    BASE_URL,
    ALGORYTHM,
    INPUT_ENCODING,
    OUTPUT_ENCODING,
    SALT_ROUNDS,
    API_KEY_CHARS,
    API_KEY_DEFAULT_LENGTH
  },
  '--------- Actual Environments -------'
);
