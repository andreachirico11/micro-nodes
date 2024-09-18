import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ModelAttributes,
} from 'sequelize';
import { SequelizeModelInitFn } from '../types/SequelizeModelInitFn';

const tableName = 'Admins';

const attributes: ModelAttributes = {
  _id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  password: {
    type: DataTypes.CHAR(60),
    allowNull: false,
  },
  adminToken: {
    type: DataTypes.STRING(100),
  }
};

export interface IAdmin {
  _id: number;
  username: string;
  password: string;
  adminToken?: string;
}


export class AdminModel
  extends Model<InferAttributes<AdminModel>, InferCreationAttributes<AdminModel>>
  implements IAdmin
{
  declare _id: number;
  declare username: string;
  declare password: string;
  declare adminToken?: string;
}

export const adminInit: SequelizeModelInitFn =  sequelize => {
  AdminModel.init(attributes, {
    sequelize,
    tableName,
  });
}
