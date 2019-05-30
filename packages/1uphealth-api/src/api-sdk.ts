import { Config, UserManagementScope, OneUpUserId, AppUserId } from './interfaces';
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
   *
   *
   * @private
   * @type {HttpClient}
   * @memberof OneUpApiSDK
   */
  private httpClient: HttpClient;

  /**
   *Creates an instance of OneUpApiSDK.
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
   * @param {(OneUpUserId & AppUserId)} parameters
   * @returns
   * @memberof OneUpApiSDK
   */
  async getUsers(parameters?: OneUpUserId & AppUserId) {
    if (parameters !== undefined) {
      Validator.getUsers(parameters);
    }
    return this.httpClient.get(
      `${this.API_URL_BASE}/user-management/v1/user`,
      {
        qs: {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          ...parameters
            ? {
              oneup_user_id: parameters.oneup_user_id,
              app_user_id: parameters.app_user_id,
            } : {},
        },
      },
    );
  }
}
