import { AxiosRequestConfig } from 'axios';

import { FHIR_DSTU2 } from './fhir-dstu2';
import { FHIR_STU3 } from './fhir-stu3';

export type HttpClientMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export namespace MethodArg {
  export interface GetUsers extends OneUpUserId, AppUserId {}
  export interface CreateUser extends AppUserId, UserActive {}
  export interface UpdateUser extends AppUserId, UserActive, OneUpUserId {}
  export interface GenerateUserAuthCode extends AppUserId {}
  export interface SearchConnectProvider extends Query {}
  export interface GetFHIRResourcesDSTU2 extends QueryParams {
    fhirVersion: 'dstu2';
    resourceType: FHIR_DSTU2.ResourceTypeStr;
  }
  export interface GetFHIRResourcesSTU3 extends QueryParams {
    fhirVersion: 'stu3';
    resourceType: FHIR_STU3.ResourceTypeStr;
  }
  export type CreateFHIRResource =
    | {
      fhirVersion: 'dstu2';
      resourceType: FHIR_DSTU2.ResourceTypeStr;
      resource: FHIR_DSTU2.Resource;
    }
    | {
      fhirVersion: 'stu3';
      resourceType: FHIR_STU3.ResourceTypeStr;
      resource: FHIR_STU3.Resource;
    };
  export interface QueryFHIREverything extends PatientId, FHIRVersion {}
  export interface GrantPermissions extends OneUpUserId, FHIRVersion {}
  export interface RevokePermissions extends OneUpUserId, FHIRVersion {}
}

export type HttpClientResponse = any;

export interface HttpClientOptions extends AxiosRequestConfig {}

export namespace Scope {
  export interface UserManagement {
    getUsers(parameters?: MethodArg.GetUsers): Promise<HttpClientResponse>;
    createUser(payload: MethodArg.CreateUser): Promise<HttpClientResponse>;
    updateUser(payload: MethodArg.UpdateUser): Promise<HttpClientResponse>;
    generateUserAuthCode(payload: MethodArg.GenerateUserAuthCode): Promise<HttpClientResponse>;
  }

  export interface UI {
    getHealthSystemPickerIFrame(): Promise<HttpClientResponse>;
  }

  export interface Connect {
    searchConnectProvider(payload: MethodArg.SearchConnectProvider): Promise<HttpClientResponse>;
    getDevices(): Promise<HttpClientResponse>;
    getSupportedHealthSystems(): Promise<HttpClientResponse>;
  }

  export interface FHIR {
    getFHIRResources(
      payload: MethodArg.GetFHIRResourcesDSTU2 | MethodArg.GetFHIRResourcesSTU3,
    ): Promise<HttpClientResponse>;
    createFHIRResource(payload: MethodArg.CreateFHIRResource): Promise<HttpClientResponse>;
    queryFHIREverything(payload: MethodArg.QueryFHIREverything): Promise<HttpClientResponse>;
    grantPermissions(payload: MethodArg.GrantPermissions): Promise<HttpClientResponse>;
    revokePermissions(payload: MethodArg.RevokePermissions): Promise<HttpClientResponse>;
  }
}

export interface Config {
  clientId?: string;
  clientSecret?: string;
}

export interface Auth {
  accessToken?: string;
  refreshToken?: string;
}

export interface OneUpUserId {
  oneupUserId: string;
}

export interface AppUserId {
  appUserId: string;
}

export interface UserActive {
  active: boolean;
}

export interface Query {
  query: string;
}

export interface QueryParams {
  queryParams?: {
    [key: string]: string;
  };
}

export interface PatientId {
  patientId: string;
}

export interface FHIRVersion {
  fhirVersion: 'dstu2' | 'stu3';
}
