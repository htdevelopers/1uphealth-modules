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
    if (!(isString(parameters.appUserId) && isString(parameters.oneupUserId))) {
      throw new Error("Parameters 'appUserId' and 'oneupUserId' are required");
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
    if (isEmpty(payload) || !(isString(payload.appUserId) && isBoolean(payload.active))) {
      throw new Error("Fields 'appUserId' and 'active' are required");
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
        isString(payload.appUserId) &&
        isString(payload.oneupUserId) &&
        isBoolean(payload.active)
      )
    ) {
      throw new Error("Fields 'appUserId', 'active' and 'oneupUserId' are required");
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
    if (isEmpty(payload) || !(isString(payload.appUserId))) {
      throw new Error("Field 'appUserId'is required");
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
      throw new Error('Access token is not provided or is invalid');
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
  static clientKeys(
    { clientId, clientSecret }: {
      clientId: Config['clientId'],
      clientSecret: Config['clientSecret'],
    }): void {
    if (isEmpty(clientSecret) || !isString(clientSecret)) {
      throw new Error('Client Secret is not provided or is invalid');
    }
    if (isEmpty(clientId) || !isString(clientId)) {
      throw new Error('Client Id is not provided or is invalid');
    }
  }
}
