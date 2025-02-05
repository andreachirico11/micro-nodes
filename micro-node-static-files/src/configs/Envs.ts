import { config } from 'dotenv';
import * as dotenvParseVariables from 'dotenv-parse-variables';
import IEnvs from '../types/IEnvs';
import { log_info } from 'micro-nodes-shared';

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

let { error, parsed: preParsingVars } = config({});
if (error) {
  log_info(error, '.env file not found, using process envs');
  preParsingVars = process.env;
}
const MICRO_PREFIX = 'MICRO_STATIC_';
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
} = parsedEnvs;

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
