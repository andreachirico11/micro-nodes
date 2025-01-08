import { ParsedVariables } from 'dotenv-parse-variables';

export default interface IEnvs extends ParsedVariables {
  PRODUCTION: boolean;
  PORT: number;
  BASE_URL: string;
  MONGO_URI: string;
  MONGO_DB: string;
  MICRO_AUTH_URI: string;
  BYPASS_AUTH: boolean;
  CONFIGS_COLLECTION_NAME: string;
  TLS_BYPASS: boolean;
}
