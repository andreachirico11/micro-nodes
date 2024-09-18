import { Options, Sequelize } from 'sequelize';
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
    timestamps: false
  }
};

export default function (...initFns: SequelizeModelInitFn[]) {
  const s = new Sequelize(DB_URI, sequelizeOptions); 
  initFns.forEach((initFn) => initFn(s));
  return s.authenticate();
}