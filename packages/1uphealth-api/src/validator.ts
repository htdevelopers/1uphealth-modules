import isString from 'lodash.isstring';
import isBoolean from 'lodash.isboolean';
import isEmpty from 'lodash.isempty';
import { Method, Auth } from './interfaces';

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
   * @param {Method.GetUsers} parameters
   * @returns {void}
   * @memberof Validator
   */
  static getUsers(parameters: Method.GetUsers): void {
    if (isEmpty(parameters)) return;
    if (!(isString(parameters.app_user_id) && isString(parameters.oneup_user_id))) {
      throw new Error("Parameters 'app_user_id' and 'oneup_user_id' are required");
    }
  }

  /**
   *
   *
   * @static
   * @param {Method.CreateUser} payload
   * @memberof Validator
   */
  static createUser(payload: Method.CreateUser): void {
    if (isEmpty(payload) || !(isString(payload.app_user_id) && isBoolean(payload.active))) {
      throw new Error("Fields 'app_user_id' and 'active' are required");
    }
  }

  /**
   *
   *
   * @static
   * @param {Method.UpdateUser} payload
   * @memberof Validator
   */
  static updateUser(payload: Method.UpdateUser): void {
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
   * @param {Method.GenerateUserAuthCode} payload
   * @memberof Validator
   */
  static generateUserAuthCode(payload: Method.GenerateUserAuthCode): void {
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
  static checkAccessToken(accessToken: Auth['accessToken']): void {
    if (isEmpty(accessToken) || !isString(accessToken)) {
      throw new Error('Not Authorized: Access token is not provided or is invalid');
    }
  }
}
