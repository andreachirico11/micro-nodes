import { string } from 'yup';

const getCharacterValidationError = (str: string) => {
  return `Your password must have at least 1 ${str} character`;
};

export default function generatePasswordSchema(
  passwordLenght: number,
  numbers: boolean,
  symbols: boolean,
  uppercaseLetters: boolean,
  symbolsRegex: string
) {
  let schema = string().min(
    passwordLenght,
    `Password must have at least ${passwordLenght} characters")`
  );
  if (numbers) {
    schema = schema.matches(/[0-9]/, getCharacterValidationError('digit'));
  }
  if (symbols) {
    schema = schema.matches(
      new RegExp(symbolsRegex, 'g'),
      `Password must contain at least one of these characters ${symbolsRegex}")`
    );
  }
  if (uppercaseLetters) {
    schema = schema.matches(/[A-Z]/, getCharacterValidationError('uppercase'));
  }
  return schema;
}
