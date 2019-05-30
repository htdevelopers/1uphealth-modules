import isString from 'lodash.isstring';
import isEmpty from 'lodash.isempty';
import { OneUpUserId, AppUserId } from './interfaces';

export default class Validator {
  static getUsers(parameters: OneUpUserId & AppUserId): void {
    if (isEmpty(parameters)) return;
    if (!(
      isString(parameters.app_user_id) &&
      isString(parameters.oneup_user_id)
    )) throw new Error("Parameters 'app_user_id' and 'oneup_user_id' are required");
  }
}
