import isString from 'lodash.isstring';
import isBoolean from 'lodash.isboolean';
import isEmpty from 'lodash.isempty';
import { MethodArg, Auth } from './types/main';

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
  static getUsers(parameters: MethodArg.GetUsers): void {
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
  static createUser(payload: MethodArg.CreateUser): void {
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
  static updateUser(payload: MethodArg.UpdateUser): void {
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
  static generateUserAuthCode(payload: MethodArg.GenerateUserAuthCode): void {
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
