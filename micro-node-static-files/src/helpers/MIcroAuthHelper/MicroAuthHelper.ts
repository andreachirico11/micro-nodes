import fetch from 'node-fetch';
import { AuthErrorResponse, AuthSuccessResp } from './models';

export class MicroAuthHelper {
  constructor(private baseUrl: string) {}

  async checkToken(appApiKey: string, authorization: string): Promise<AuthSuccessResp | AuthErrorResponse> {
    return await(
      await fetch(this.baseUrl + '/auth', { headers: { "app-api-key": appApiKey, authorization } })
    ).json();
  }

  async ping() {
    const { ok } = await fetch(this.baseUrl + '/ping');
    return ok;
  }
}
