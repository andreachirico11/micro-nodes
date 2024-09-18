import { DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from 'sequelize';
import { SequelizeModelInitFn } from '../types/SequelizeModelInitFn';

export class PingTest extends Model<InferAttributes<PingTest>, InferCreationAttributes<PingTest>> {
  declare name: string;
}

export const pingTestInit: SequelizeModelInitFn =  sequelize => {
  PingTest.init(
    {
      name: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      tableName: 'pingTests',
    }
  );
}
