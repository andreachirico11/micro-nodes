
export default interface IEnvs {
  PRODUCTION: boolean;
  PORT: number;
  BASE_URL: string;
  SYMBOLS_REGEX: string;
  MICRO_HASH_URI: string;
  ADMIN_CRUDS: boolean;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_SSL: boolean;
  TLS_BYPASS: boolean;
}
  