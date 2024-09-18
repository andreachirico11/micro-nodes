import { object, string } from 'yup';


export const cryptValidator = object({
    input: string().required(),
    secretKey: string().required()
})