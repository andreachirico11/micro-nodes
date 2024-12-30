import { Options, Sequelize } from 'sequelize';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER, DB_SSL } from './Envs';
import { SequelizeModelInitFn } from '../types/SequelizeModelInitFn';

const sequelizeOptions: Options = {
  dialect: 'mysql',
  host: DB_HOST,
  port: DB_PORT,
  ssl: DB_SSL,
  define: {
    timestamps: false,
  },
};

export default function (...initFns: SequelizeModelInitFn[]) {
  const s = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, sequelizeOptions);
  initFns.forEach((initFn) => initFn(s));
  return s.authenticate();
}
