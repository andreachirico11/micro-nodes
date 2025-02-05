import IEnvs from '../types/IEnvs';
import { log_info, NodeTlsHandler, getEnvs } from 'micro-nodes-shared';

const defaultEnvs: IEnvs = {
  PORT: 1112,
  PRODUCTION: false,
  BASE_URL: '',
  SYMBOLS_REGEX: '[!@#$%&*(\\)_+=|<>?\\[\\]{}]',
  MICRO_HASH_URI: '',
  ADMIN_CRUDS: false,
  DB_HOST: '',
  DB_PORT: 3306,
  DB_USER: '',
  DB_PASSWORD: '',
  DB_NAME: '',
  DB_SSL: false,
  TLS_BYPASS: false,
};

export const {
  PORT = defaultEnvs.PORT,
  PRODUCTION = defaultEnvs.PRODUCTION,
  BASE_URL = defaultEnvs.BASE_URL,
  SYMBOLS_REGEX = defaultEnvs.SYMBOLS_REGEX,
  MICRO_HASH_URI = defaultEnvs.MICRO_HASH_URI,
  ADMIN_CRUDS = defaultEnvs.ADMIN_CRUDS,
  DB_HOST = defaultEnvs.DB_HOST,
  DB_NAME = defaultEnvs.DB_NAME,
  DB_PASSWORD = defaultEnvs.DB_PASSWORD,
  DB_PORT = defaultEnvs.DB_PORT,
  DB_USER = defaultEnvs.DB_USER,
  DB_SSL = defaultEnvs.DB_SSL,
  TLS_BYPASS = defaultEnvs.TLS_BYPASS,
} = getEnvs<IEnvs>('MICRO_AUTH_');

NodeTlsHandler.setup(TLS_BYPASS);

log_info(
  {
    PORT,
    PRODUCTION,
    BASE_URL,
    SYMBOLS_REGEX,
    MICRO_HASH_URI,
    ADMIN_CRUDS,
    DB_HOST,
    DB_NAME,
    DB_PORT,
    DB_USER,
    DB_SSL,
    TLS_BYPASS,
  },
  '--------- Actual Environments -------'
);
