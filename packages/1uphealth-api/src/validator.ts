import isString from 'lodash.isstring';
import isBoolean from 'lodash.isboolean';
import isEmpty from 'lodash.isempty';
import { MethodArg, Auth, Config } from './types/main';

/**
 *
 *
 * @export
 * @class Validator
 */
export default class Validator {
  /**
   *
   *
   * @static
   * @param {MethodArg.GetUsers} parameters
   * @returns {void}
   * @memberof Validator
   */
  static getUsersPayload(parameters: MethodArg.GetUsers): void {
    if (isEmpty(parameters)) return;
    if (!(isString(parameters.app_user_id) && isString(parameters.oneup_user_id))) {
      throw new Error("Parameters 'app_user_id' and 'oneup_user_id' are required");
    }
  }

  /**
   *
   *
   * @static
   * @param {MethodArg.CreateUser} payload
   * @memberof Validator
   */
  static createUserPayload(payload: MethodArg.CreateUser): void {
    if (isEmpty(payload) || !(isString(payload.app_user_id) && isBoolean(payload.active))) {
      throw new Error("Fields 'app_user_id' and 'active' are required");
    }
  }

  /**
   *
   *
   * @static
   * @param {MethodArg.UpdateUser} payload
   * @memberof Validator
   */
  static updateUserPayload(payload: MethodArg.UpdateUser): void {
    if (
      isEmpty(payload) ||
      !(
        isString(payload.app_user_id) &&
        isString(payload.oneup_user_id) &&
        isBoolean(payload.active)
      )
    ) {
      throw new Error("Fields 'app_user_id', 'active' and 'oneup_user_id' are required");
    }
  }

  /**
   *
   *
   * @static
   * @param {MethodArg.GenerateUserAuthCode} payload
   * @memberof Validator
   */
  static generateUserAuthCodePayload(payload: MethodArg.GenerateUserAuthCode): void {
    if (isEmpty(payload) || !(isString(payload.app_user_id))) {
      throw new Error("Field 'app_user_id'is required");
    }
  }

  /**
   *
   *
   * @static
   * @param {Auth['accessToken']} accessToken
   * @memberof Validator
   */
  static accessToken(accessToken: Auth['accessToken']): void {
    if (isEmpty(accessToken) || !isString(accessToken)) {
      throw new Error('Not Authorized: Access token is not provided or is invalid');
    }
  }

  /**
   *
   *
   * @static
   * @param {Config['clientId']} clientId
   * @param {Config['clientSecret']} clientSecret
   * @memberof Validator
   */
  static clientKeys(clientId: Config['clientId'], clientSecret: Config['clientSecret']): void {
    if (isEmpty(clientSecret) || !isString(clientSecret)) {
      throw new Error('Not Authorized: Client Secret is not provided or is invalid');
    }
    if (isEmpty(clientId) || !isString(clientId)) {
      throw new Error('Not Authorized: Client Id is not provided or is invalid');
    }
  }
}
