// TODO: Handle 302 anauthorized redirection in all endpoints..

import {
  Config,
  Scope,
  Auth,
  HttpClientResponse,
  Method,
} from './interfaces';
import HttpClient from './http-client';
import Validator from './validator';

/**
 *
 *
 * @export
 * @class OneUpApiSDK
 * @implements {Config}
 * @implements {UserManagementScope}
 */
export default class OneUpApiSDK
  implements Config, Auth, Scope.UserManagement, Scope.UI, Scope.Connect {
  /**
   *
   *
   * @type {Config['clientId']}
   * @memberof OneUpApiSDK
   */
  public clientId: Config['clientId'];

  /**
   *
   *
   * @type {Config['clientSecret']}
   * @memberof OneUpApiSDK
   */
  public clientSecret: Config['clientSecret'];

  /**
   *
   *
   * @type {string}
   * @memberof OneUpApiSDK
   */
  public API_URL_BASE: string = 'https://api.1up.health';

  /**
   *
   *
   * @type {Auth['accessToken']}
   * @memberof OneUpApiSDK
   */
  public accessToken: Auth['accessToken'];

  /**
   *
   *
   * @type {Auth['refreshToken']}
   * @memberof OneUpApiSDK
   */
  public refreshToken: Auth['refreshToken'];

  /**
   * Http client, abstraction over 'request' library
   *
   * @private
   * @type {HttpClient}
   * @memberof OneUpApiSDK
   */
  private httpClient: HttpClient;

  /**
   * Creates an instance of OneUpApiSDK.
   *
   * @param {Config} config
   * @memberof OneUpApiSDK
   */
  public constructor(config: Config) {
    this.clientId = config['clientId'];
    this.clientSecret = config['clientSecret'];
    this.httpClient = new HttpClient();
  }

  /**
   * GET /user-management/v1/user
   *
   * @param {Method.GetUsers} [parameters]
   * @returns {Promise<HttpClientResponse>}
   * @memberof OneUpApiSDK
   */
  async getUsers(parameters?: Method.GetUsers): Promise<HttpClientResponse> {
    if (parameters !== undefined) {
      Validator.getUsers(parameters);
    }
    return this.httpClient.get(`${this.API_URL_BASE}/user-management/v1/user`, {
      qs: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        ...(parameters
          ? {
            oneup_user_id: parameters.oneup_user_id,
            app_user_id: parameters.app_user_id,
          }
          : {}),
      },
    });
  }

  /**
   * POST /user-management/v1/user
   *
   * @param {Method.CreateUser} payload
   * @returns {Promise<HttpClientResponse>}
   * @memberof OneUpApiSDK
   */
  async createUser(payload: Method.CreateUser): Promise<HttpClientResponse> {
    Validator.createUser(payload);
    return this.httpClient.post(`${this.API_URL_BASE}/user-management/v1/user`, {
      qs: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        app_user_id: payload.app_user_id,
        active: payload.active,
      },
    });
  }

  /**
   * PUT /user-management/v1/user
   *
   * @param {Method.UpdateUser} payload
   * @returns {Promise<HttpClientResponse>}
   * @memberof OneUpApiSDK
   */
  async updateUser(payload: Method.UpdateUser): Promise<HttpClientResponse> {
    Validator.updateUser(payload);
    return this.httpClient.put(`${this.API_URL_BASE}/user-management/v1/user`, {
      qs: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        app_user_id: payload.app_user_id,
        oneup_user_id: payload.oneup_user_id,
        active: payload.active,
      },
    });
  }

  /**
   * POST /user-management/v1/user/auth-code
   *
   * @param {Method.GenerateUserAuthCode} payload
   * @returns {Promise<HttpClientResponse>}
   * @memberof OneUpApiSDK
   */
  async generateUserAuthCode(payload: Method.GenerateUserAuthCode): Promise<HttpClientResponse> {
    Validator.generateUserAuthCode(payload);
    return this.httpClient.post(`${this.API_URL_BASE}/user-management/v1/user/auth-code`, {
      qs: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        app_user_id: payload.app_user_id,
      },
    });
  }

  /**
   * GET /connect/marketplace
   * returns HTML
   *
   * @returns {Promise<HttpClientResponse>}
   * @memberof OneUpApiSDK
   */
  async getHealthSystemPickerIFrame(): Promise<HttpClientResponse> {
    Validator.checkAccessToken(this.accessToken);
    return this.httpClient.get(`${this.API_URL_BASE}/connect/marketplace`, {
      qs: {
        client_id: this.clientId,
        access_token: this.accessToken,
      },
    });
  }

  /**
   * GET /connect/system/provider
   *
   * @param {Method.SearchConnectProvider} { query: q }
   * @returns {Promise<HttpClientResponse>}
   * @memberof OneUpApiSDK
   */
  async searchConnectProvider(
    { query: q }: Method.SearchConnectProvider,
  ): Promise<HttpClientResponse> {
    Validator.checkAccessToken(this.accessToken);
    return this.httpClient.get(`${this.API_URL_BASE}/connect/system/provider/search`, {
      headers: {
        ...this.httpClient.defaultOptions.headers,
        Authorization: `Bearer ${this.accessToken}`,
      },
      qs: {
        q,
      },
    });
  }
}