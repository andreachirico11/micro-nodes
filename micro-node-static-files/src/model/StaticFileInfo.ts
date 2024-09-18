import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ModelAttributes,
} from 'sequelize';
import { SequelizeModelInitFn } from '../types/SequelizeModelInitFn';

const tableName = 'StaticFilesInfo';

const attributes: ModelAttributes = {
  _id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  fileName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  filePath: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  folderPath: {
    type: DataTypes.STRING(100)
  },
  type: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  app_api_key: {
    type: DataTypes.STRING(100),
  },
  creation: {
    type: DataTypes.DATE,
  },
};

export interface IStaticFileInfo {
  _id?: number;
  fileName: string;
  filePath: string;
  type: string;
  app_api_key?: string;
  creation?: Date;
  folderPath?: string;
}

export class StaticFileInfo
  extends Model<InferAttributes<StaticFileInfo>, InferCreationAttributes<StaticFileInfo>>
  implements IStaticFileInfo
{
  declare _id: number;
  declare fileName: string;
  declare filePath: string;
  declare type: string;
  declare app_api_key?: string;
  declare creation: Date;
  declare folderPath: string;
}

export const staticFileInfoInitInit: SequelizeModelInitFn = (sequelize) => {
  StaticFileInfo.init(attributes, {
    sequelize,
    tableName,
  });
};
