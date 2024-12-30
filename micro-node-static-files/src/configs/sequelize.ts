import { Options, Sequelize, Transaction } from 'sequelize';
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

const s = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, sequelizeOptions);

export default function (...initFns: SequelizeModelInitFn[]) {
  initFns.forEach((initFn) => initFn(s));
  return s.authenticate();
}

export function createTransaction() {
  return new Transaction(s, { autocommit: false });
}
