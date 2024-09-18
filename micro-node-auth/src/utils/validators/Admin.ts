import { object, number, string, date } from 'yup';

export const adminCreation = object({
  username: string().required(),
  password: string().required(),
}).required();