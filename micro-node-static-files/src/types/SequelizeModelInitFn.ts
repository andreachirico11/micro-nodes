import { Sequelize } from "sequelize";

export type SequelizeModelInitFn = (sequelize: Sequelize) => void;