import { randomBytes } from 'crypto';

const getKey = (length: number, allowedChars: string) => {
  let str = '';
  const rand = randomBytes(length);
  for (let i = 0; i < rand.length; i++) {
    let index = rand[i] % allowedChars.length;
    str += allowedChars[index];
  }
  return str;
};

export default getKey;
