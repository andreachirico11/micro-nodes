import { config } from 'dotenv';
import * as dotenvParseVariables from 'dotenv-parse-variables';
import IEnvs from '../types/IEnvs';
import { log_info } from '../utils/log';

const defaultEnvs: IEnvs = {
  PORT: 2222,
  PRODUCTION: false,
  BASE_URL: '',
  MICRO_AUTH_URI: '',
  BYPASS_AUTH: false,
  STORAGE_PATH: 'TEMP',
  FILE_MAX_SIZE: 20000000,
  DB_URI: '',
};

let { error, parsed: preParsingVars } = config({});
if (error) {
  log_info(error, '.env file not found, using process envs');
  preParsingVars = process.env;
}
const parsedEnvs = dotenvParseVariables(preParsingVars) as IEnvs;

export class NodeTlsHandler {
  static disableTls() {
  log_info('Disabling tls');
    this.tls = false;
  }

  static enableTls() {
    log_info('Enabling tls');
    this.tls = true;
  }

  private static set tls(value: boolean) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = value ? "1" : "0";
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
  DB_URI = defaultEnvs.DB_URI
} = parsedEnvs;



log_info(
  {
    PORT,
    PRODUCTION,
    BASE_URL,
    MICRO_AUTH_URI,
    BYPASS_AUTH,
    STORAGE_PATH,
    FILE_MAX_SIZE,
    DB_URI
  },
  '--------- Actual Environments -------'
);
