import isString from 'lodash.isstring';
import isBoolean from 'lodash.isboolean';
import isEmpty from 'lodash.isempty';
import { OneUpUserId, AppUserId, UserActive } from './interfaces';

export default class Validator {
  static getUsers(parameters: OneUpUserId & AppUserId): void {
    if (isEmpty(parameters)) return;
    if (!(isString(parameters.app_user_id) && isString(parameters.oneup_user_id))) {
      throw new Error("Parameters 'app_user_id' and 'oneup_user_id' are required");
    }
  }

  static createUser(payload: AppUserId & UserActive): void {
    if (isEmpty(payload) || !(isString(payload.app_user_id) && isBoolean(payload.active))) {
      throw new Error("Fields 'app_user_id' and 'active' are required");
    }
  }

  static updateUser(payload: AppUserId & UserActive & OneUpUserId): void {
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
}
