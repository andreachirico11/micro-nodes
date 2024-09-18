import {ParsedVariables} from "dotenv-parse-variables";
import { Algorythm } from "./Algorythm";
import { Encoding } from "crypto";

export default interface IEnvs extends ParsedVariables {
    PRODUCTION: boolean;
    PORT: number;
    BASE_URL: string;
    ALGORYTHM: Algorythm;
    INPUT_ENCODING: Encoding;
    OUTPUT_ENCODING: Encoding;
    SALT_ROUNDS: number;
    API_KEY_CHARS: string;
    API_KEY_DEFAULT_LENGTH: number;
  }
  