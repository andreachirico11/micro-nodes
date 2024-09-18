import { object, string } from 'yup';


export const hashValidator = object({
    input: string().required()
})

export const compareValidator = object({
    hash: string().required(),
    compareWith: string().required(),
})