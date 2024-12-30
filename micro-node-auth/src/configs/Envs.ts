import { config } from 'dotenv';
import * as dotenvParseVariables from 'dotenv-parse-variables';
import IEnvs from '../types/IEnvs';
import { log_info } from '../utils/log';

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
} = parsedEnvs;

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
  },
  '--------- Actual Environments -------'
);
