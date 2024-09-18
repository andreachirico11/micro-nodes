import { ParsedVariables } from 'dotenv-parse-variables';

export default interface IEnvs extends ParsedVariables {
  PRODUCTION: boolean;
  PORT: number;
  BASE_URL: string;
  MICRO_AUTH_URI: string;
  BYPASS_AUTH: boolean;
  STORAGE_PATH: string;
  FILE_MAX_SIZE: number;
  DB_URI: string;
}
