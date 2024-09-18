import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ModelAttributes,
  Sequelize,
} from 'sequelize';
import { IAppId } from './App';
import { SequelizeModelInitFn } from '../types/SequelizeModelInitFn';

const tableName = 'Users';

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
  password: {
    type: DataTypes.CHAR(60),
    allowNull: false,
  },
  datePasswordChange: {
    type: DataTypes.DATE,
  },
  authToken: {
    type: DataTypes.STRING(100),
  },
  dateTokenExp: {
    type: DataTypes.DATE,
  },
  app_id: {
    type: DataTypes.INTEGER,
  },
  refreshToken: {
    type: DataTypes.STRING(100),
  },
  dateRefTokenExp: {
    type: DataTypes.DATE,
  },
  dateResetTokenExp: {
    type: DataTypes.DATE,
  },
  resetToken: {
    type: DataTypes.STRING(100),
  },
};

export interface IUser {
  _id: number;
  name: string;
  dateAdd: Date;
  password: string;
  datePasswordChange?: Date;
  authToken?: string;
  dateTokenExp?: Date;
  app_id?: number;
  refreshToken?: string;
  dateRefTokenExp?: Date;
  resetToken?: string;
  dateResetTokenExp?: Date;
}

export interface IAuthUser extends IAppId {
  username: string;
  password: string;
}

export class UserModel
  extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>>
  implements IUser
{
  declare _id: number;
  declare name: string;
  declare dateAdd: Date;
  declare password: string;
  declare datePasswordChange?: Date;
  declare authToken?: string;
  declare dateTokenExp?: Date;
  declare app_id?: number;
  declare refreshToken?: string;
  declare dateRefTokenExp?: Date;
  declare resetToken?: string;
  declare dateResetTokenExp?: Date;
}

export const userInit: SequelizeModelInitFn =  sequelize => {
  UserModel.init(attributes, {
    sequelize,
    tableName,
  });
}
