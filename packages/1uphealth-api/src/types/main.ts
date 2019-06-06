import { AxiosRequestConfig } from 'axios';
import ApiSDK from '../api-sdk';

export type HttpClientMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export type HttpClientResponse = any;

export interface HttpClientOptions extends AxiosRequestConfig {}

export interface Config {
  clientId: ApiSDK['clientId'];
  clientSecret: ApiSDK['clientSecret'];
}

export interface Auth {
  accessToken: ApiSDK['accessToken'];
  refreshToken: ApiSDK['refreshToken'];
}

export type OneUpUserId = string;
export type AppUserId = string;
export type UserActive = boolean;
export type Query = string;
export type QueryParams = { [key: string]: string; } | undefined;
export type PatientId = string;
export type FHIRVersion = 'dstu2' | 'stu3';
