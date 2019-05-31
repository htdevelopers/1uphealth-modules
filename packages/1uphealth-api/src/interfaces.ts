import request from 'request';

export type HttpClientMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export interface HttpClientResponse {
  success: boolean;
  status: number;
  statusMessage: string;
  body: any;
}

export interface HttpClientOptions extends request.CoreOptions {}

export interface Config {
  clientId: string;
  clientSecret: string;
}

export interface Auth {
  accessToken?: string;
  refreshToken?: string;
}

export namespace Scope {
  export interface UserManagement {
    getUsers(parameters?: Method.GetUsers): Promise<HttpClientResponse>;
    createUser(payload: Method.CreateUser): Promise<HttpClientResponse>;
    updateUser(payload: Method.UpdateUser): Promise<HttpClientResponse>;
    generateUserAuthCode(payload: Method.GenerateUserAuthCode): Promise<HttpClientResponse>;
  }

  export interface UI {
    getHealthSystemPickerIFrame(): Promise<HttpClientResponse>;
  }
}

export interface OneUpUserId {
  oneup_user_id: string;
}

export interface AppUserId {
  app_user_id: string;
}

export interface ClientId {
  oneup_user_id: string;
}

export interface ClientSecret {
  oneup_user_id: string;
}

export interface UserActive {
  active: boolean;
}

export namespace Method {
  export interface GetUsers extends OneUpUserId, AppUserId {}
  export interface CreateUser extends AppUserId, UserActive {}
  export interface UpdateUser extends AppUserId, UserActive, OneUpUserId {}
  export interface GenerateUserAuthCode extends AppUserId {}
}
