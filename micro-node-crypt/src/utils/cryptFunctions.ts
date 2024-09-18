import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { ALGORYTHM, INPUT_ENCODING, OUTPUT_ENCODING } from '../configs/Envs';
import { log_info } from './log';

let initVector;
let keyParser;

(function () {
  let vectorLength, parserLength;
  switch (ALGORYTHM) {
    case 'aes256':
    default:
      vectorLength = 16;
      parserLength = 32;
      break;
  }
  initVector = randomBytes(vectorLength);
  keyParser = (secretKey: string) => Buffer.alloc(parserLength, secretKey);
})();

export const cypher = (text: string, secretKey: string) => {
  log_info('Crypting with algorythm: ' + ALGORYTHM);
  const cipher = createCipheriv(ALGORYTHM, keyParser(secretKey), initVector);
  const dectrypted = cipher.update(text, INPUT_ENCODING, OUTPUT_ENCODING);
  const finalPart = cipher.final(OUTPUT_ENCODING);
  return dectrypted + finalPart;
};

export const decypher = (encryptedData: string, secretKey: string) => {
  log_info('Decrypting with algorythm: ' + ALGORYTHM);
  const decipher = createDecipheriv(ALGORYTHM, keyParser(secretKey), initVector);
  const dectrypted = decipher.update(encryptedData, OUTPUT_ENCODING, INPUT_ENCODING);
  const finalPart = decipher.final(INPUT_ENCODING);
  return (dectrypted + finalPart).toString();
};