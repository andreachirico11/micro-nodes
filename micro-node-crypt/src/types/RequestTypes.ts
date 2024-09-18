import { Request } from 'express';

export type CryptBody = {input: string, secretKey: string};

export type CryptReq = Request<{}, {}, CryptBody>;

export type HashBody = {input: string};

export type CompareBody = {hash: string, compareWith: string};

export type HashReq = Request<{}, {}, HashBody>;

export type CompareReq = Request<{}, {}, CompareBody>;
