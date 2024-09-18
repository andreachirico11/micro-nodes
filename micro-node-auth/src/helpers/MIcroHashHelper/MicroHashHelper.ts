import fetch from 'node-fetch';
import { HashResponse, HashErrorResponse, HashCompareResponse, ApiKeyResponse } from './models';

export class MicroHashHelper {
  constructor(private baseUrl: string) {}

  async getNewApiKey(): Promise<ApiKeyResponse> {
    return this.getReq(this.baseUrl + '/key');
  }

  async hashString(input: string): Promise<HashResponse | HashErrorResponse> {
    return this.postReq('hash', { input });
  }

  async compareString(
    hash: string,
    compareWith: string
  ): Promise<HashCompareResponse | HashErrorResponse> {
    return this.postReq('hashCompare', { hash, compareWith });
  }

  async ping() {
    const { ok } = await fetch(this.baseUrl + '/ping');
    return ok;
  }

  private async postReq(endPoint: string, body: Object) {
    const url = this.baseUrl + '/' + endPoint;
    const r = await fetch(url, {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    });
    return r.json();
  }

  private async getReq(url: string) {
    const r = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
    });
    return r.json();
  }
}
