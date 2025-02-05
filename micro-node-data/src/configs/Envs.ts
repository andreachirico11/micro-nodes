import IEnvs from '../types/IEnvs';
import { getEnvs, log_info, NodeTlsHandler } from 'micro-nodes-shared';
import { CrudOperations } from '../types/CrudOperations';

const defaultEnvs: IEnvs = {
  PORT: 1114,
  PRODUCTION: false,
  BASE_URL: '',
  MONGO_URI: '',
  MICRO_AUTH_URI: '',
  BYPASS_AUTH: false,
  CONFIGS_COLLECTION_NAME: 'collection_config',
  MONGO_DB: 'micro-data',
  TLS_BYPASS: false,
};


export const {
  PORT = defaultEnvs.PORT,
  PRODUCTION = defaultEnvs.PRODUCTION,
  BASE_URL = defaultEnvs.BASE_URL,
  MONGO_URI = defaultEnvs.MONGO_URI,
  MICRO_AUTH_URI = defaultEnvs.MICRO_AUTH_URI,
  BYPASS_AUTH = defaultEnvs.BYPASS_AUTH,
  CONFIGS_COLLECTION_NAME = defaultEnvs.CONFIGS_COLLECTION_NAME,
  MONGO_DB = defaultEnvs.MONGO_DB,
  TLS_BYPASS = defaultEnvs.TLS_BYPASS,
} = getEnvs<IEnvs>('MICRO_DATA_');

export const DEFAULT_UNCHEKED_OPS: CrudOperations[] = [CrudOperations.GET];

NodeTlsHandler.setup(TLS_BYPASS);

log_info(
  {
    PORT,
    PRODUCTION,
    BASE_URL,
    MONGO_URI,
    MICRO_AUTH_URI,
    BYPASS_AUTH,
    CONFIGS_COLLECTION_NAME,
    MONGO_DB,
    TLS_BYPASS,
  },
  '--------- Actual Environments -------'
);
