import { object, number, string } from 'yup';

export const userCreation = object({
  name: string().required(),
  password: string().required(),
}).required();

export const userUpdate = object({
  name: string(),
}).required();

export const userAuth = object({
  username: string().required(),
  password: string().required()
}).required();

export const userPasswordChange = object({
  username: string().required(),
  password: string().required(),
  newPassword: string().required(),
}).required();
