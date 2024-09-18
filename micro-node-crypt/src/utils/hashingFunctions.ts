import { SALT_ROUNDS } from '../configs/Envs';
import { log_info } from './log';
import {hashSync, compareSync} from 'bcrypt';

export const hasher = (input: string) => {
  log_info('Hashing salt rounds: ' + SALT_ROUNDS);
  return hashSync(input, SALT_ROUNDS);
};

export const comparer = (hash: string, input: string) => {
  return compareSync(input, hash);
};