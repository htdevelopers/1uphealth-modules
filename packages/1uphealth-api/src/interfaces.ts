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

export interface UserManagementScope {
  getUsers(parameters?: OneUpUserId & AppUserId): Promise<HttpClientResponse>;
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
