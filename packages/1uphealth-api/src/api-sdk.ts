import {
  Config,
  UserManagementScope,
  HttpClientResponse,
  Methods,
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
export default class OneUpApiSDK implements Config, UserManagementScope {
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
   * @param {Methods.GetUsers} [parameters]
   * @returns {Promise<HttpClientResponse>}
   * @memberof OneUpApiSDK
   */
  async getUsers(parameters?: Methods.GetUsers): Promise<HttpClientResponse> {
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
   * @param {Methods.CreateUser} payload
   * @returns {Promise<HttpClientResponse>}
   * @memberof OneUpApiSDK
   */
  async createUser(payload: Methods.CreateUser): Promise<HttpClientResponse> {
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
   * @param {Methods.UpdateUser} payload
   * @returns {Promise<HttpClientResponse>}
   * @memberof OneUpApiSDK
   */
  async updateUser(payload: Methods.UpdateUser): Promise<HttpClientResponse> {
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
}
