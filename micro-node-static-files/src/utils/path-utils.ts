
import { join } from 'path';

const subPathRegex = /^(\w+)(,\w+)*$/;



export const getFilePath = (baseFolder: string, subPath?: string) => {
  if (!!!subPath) return baseFolder;
  if (!subPathRegex.test(subPath)) {
    throw new Error('Invalid subPath format. It should only contain strings separated by commas.');
  }
  return join(baseFolder, ...subPath.split(','));
};

export const getFilePathWithTItle = (title: string, baseFolder: string, subPath?: string) => {
  return join(getFilePath(baseFolder, subPath), title)
}