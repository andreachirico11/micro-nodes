import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ModelAttributes,
} from 'sequelize';
import { SequelizeModelInitFn } from '../types/SequelizeModelInitFn';

const tableName = 'Apps';

const attributes: ModelAttributes = {
  _id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  dateAdd: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  passwordLenght: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  uppercaseLetters: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  symbols: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  numbers: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  refreshToken: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  canCheckWithApiKeyOnly: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  symbolsRegex: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tokenExpirationMs: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  refreshTokenExpirationMs: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  resetTokeExpirationMs: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  apiKey: {
    type: DataTypes.STRING(100),
  },
};

export interface IApp {
  _id?: number;
  name: string;
  dateAdd: Date;
  passwordLenght: number;
  uppercaseLetters: boolean;
  symbols: boolean;
  numbers: boolean;
  refreshToken: boolean;
  canCheckWithApiKeyOnly: boolean;
  symbolsRegex?: string;
  tokenExpirationMs?: number;
  refreshTokenExpirationMs?: number;
  resetTokeExpirationMs?: number;
  apiKey?: string;
}

export class AppModel
  extends Model<InferAttributes<AppModel>, InferCreationAttributes<AppModel>>
  implements IApp
{
  declare _id: number;
  declare name: string;
  declare dateAdd: Date;
  declare passwordLenght: number;
  declare uppercaseLetters: boolean;
  declare symbols: boolean;
  declare numbers: boolean;
  declare refreshToken: boolean;
  declare canCheckWithApiKeyOnly: boolean;
  declare symbolsRegex?: string;
  declare tokenExpirationMs?: number;
  declare refreshTokenExpirationMs?: number;
  declare resetTokeExpirationMs?: number;
  declare apiKey?: string;
}

export const appInit: SequelizeModelInitFn = (sequelize) => {
  AppModel.init(attributes, {
    sequelize,
    tableName,
  });
};

export interface IAppId {
  appId: number;
}
