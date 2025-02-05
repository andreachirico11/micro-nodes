import IEnvs from '../types/IEnvs';
import { getEnvs, log_info, NodeTlsHandler } from 'micro-nodes-shared';

const defaultEnvs: IEnvs = {
  PORT: 1113,
  PRODUCTION: false,
  BASE_URL: '',
  MICRO_AUTH_URI: '',
  BYPASS_AUTH: false,
  STORAGE_PATH: 'TEMP',
  FILE_MAX_SIZE: 20000000,
  DB_HOST: '',
  DB_PORT: 3306,
  DB_USER: '',
  DB_PASSWORD: '',
  DB_NAME: '',
  DB_SSL: false,
  TLS_BYPASS: false,
};

export const MULTIPART_FILE_PROP_NAME = 'file' as const;

export const {
  PORT = defaultEnvs.PORT,
  PRODUCTION = defaultEnvs.PRODUCTION,
  BASE_URL = defaultEnvs.BASE_URL,
  MICRO_AUTH_URI = defaultEnvs.MICRO_AUTH_URI,
  BYPASS_AUTH = defaultEnvs.BYPASS_AUTH,
  FILE_MAX_SIZE = defaultEnvs.FILE_MAX_SIZE,
  STORAGE_PATH = defaultEnvs.STORAGE_PATH,
  DB_HOST = defaultEnvs.DB_HOST,
  DB_NAME = defaultEnvs.DB_NAME,
  DB_PASSWORD = defaultEnvs.DB_PASSWORD,
  DB_PORT = defaultEnvs.DB_PORT,
  DB_USER = defaultEnvs.DB_USER,
  DB_SSL = defaultEnvs.DB_SSL,
  TLS_BYPASS = defaultEnvs.TLS_BYPASS,
} = getEnvs<IEnvs>('MICRO_STATIC_');

NodeTlsHandler.setup(TLS_BYPASS);

log_info(
  {
    PORT,
    PRODUCTION,
    BASE_URL,
    MICRO_AUTH_URI,
    BYPASS_AUTH,
    STORAGE_PATH,
    FILE_MAX_SIZE,
    DB_HOST,
    DB_NAME,
    DB_PORT,
    DB_USER,
    DB_SSL,
    TLS_BYPASS,
  },
  '--------- Actual Environments -------'
);
