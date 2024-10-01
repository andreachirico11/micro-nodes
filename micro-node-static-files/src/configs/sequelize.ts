import { Options, Sequelize, Transaction } from 'sequelize';
import { DB_URI, PRODUCTION } from './Envs';
import { SequelizeModelInitFn } from '../types/SequelizeModelInitFn';

const sequelizeOptions: Options = {
  ...(PRODUCTION && {
    dialectOptions: {
      ssl: {
        rejectUnauthorized: true,
      },
    },
  }),
  define: {
    timestamps: false,
  },
};

  const s = new Sequelize(DB_URI, sequelizeOptions);

export default function (...initFns: SequelizeModelInitFn[]) {
  initFns.forEach((initFn) => initFn(s));
  return s.authenticate();
}

export function createTransaction() {
  return new Transaction(s, {autocommit: false})
}
