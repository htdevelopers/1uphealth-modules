import isString from 'lodash.isstring';
import isBoolean from 'lodash.isboolean';
import isEmpty from 'lodash.isempty';
import { Auth, Config, OneUpUserId, AppUserId, UserActive } from './types/main';

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
   * @param {OneUpUserId} [oneUpUserId]
   * @param {AppUserId} [appUserId]
   * @memberof Validator
   */
  static getUsersPayload(oneUpUserId?: OneUpUserId, appUserId?: AppUserId): void {
    if (oneUpUserId === undefined && appUserId === undefined) return;
    if (
        !isString(appUserId) ||
        !isString(oneUpUserId) ||
        isEmpty(appUserId) ||
        isEmpty(oneUpUserId)
    ) {
      throw new Error("Parameters 'appUserId' and 'oneUpUserId' are required");
    }
  }

  /**
   *
   *
   * @static
   * @param {AppUserId} appUserId
   * @param {UserActive} userActive
   * @memberof Validator
   */
  static createUserPayload(appUserId: AppUserId, userActive: UserActive): void {
    if (!isString(appUserId) || !isBoolean(userActive)) {
      throw new Error("Fields 'appUserId' and 'userActive' are required");
    }
  }

  /**
   *
   *
   * @static
   * @param {AppUserId} appUserId
   * @param {OneUpUserId} oneUpUserId
   * @param {UserActive} userActive
   * @memberof Validator
   */
  static updateUserPayload(
    appUserId: AppUserId,
    oneUpUserId: OneUpUserId,
    userActive: UserActive,
  ): void {
    if (
      !(
        isString(appUserId) &&
        isString(oneUpUserId) &&
        isBoolean(userActive)
      )
    ) {
      throw new Error("Fields 'appUserId', 'userActive' and 'oneUpUserId' are required");
    }
  }

  /**
   *
   *
   * @static
   * @param {AppUserId} appUserId
   * @memberof Validator
   */
  static generateUserAuthCodePayload(
    appUserId: AppUserId,
  ): void {
    if (!(isString(appUserId))) {
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
