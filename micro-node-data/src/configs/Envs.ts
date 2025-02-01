import { config } from 'dotenv';
import * as dotenvParseVariables from 'dotenv-parse-variables';
import IEnvs from '../types/IEnvs';
import { log_info } from '../utils/log';
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

let { error, parsed: preParsingVars } = config({});
if (error) {
  log_info(error, '.env file not found, using process envs');
  preParsingVars = process.env;
}
const MICRO_PREFIX = 'MICRO_DATA_';
preParsingVars = Object.keys(preParsingVars)
.filter((key) => key.startsWith(MICRO_PREFIX))
.reduce(
  (acc, key) => ({
    ...acc,
    [key.replace(MICRO_PREFIX, '')]: preParsingVars[key],
  }),
  {}
);
const parsedEnvs = dotenvParseVariables(preParsingVars) as IEnvs;

export class NodeTlsHandler {
  static disableTls() {
    if (!this.activated) return;
    log_info('Disabling tls');
    this.tls = false;
  }

  static enableTls() {
    if (!this.activated) return;
    log_info('Enabling tls');
    this.tls = true;
  }

  private static set tls(value: boolean) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = value ? '1' : '0';
  }

  private static activated = null;

  static setup(isActivated: boolean) {
    if (this.activated !== null) return;
    this.activated = isActivated;
  }
}

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
} = parsedEnvs;

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
