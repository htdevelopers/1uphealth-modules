// TODO: Handle 302 anauthorized redirection in all endpoints.
// TODO: validation using io-ts?

import {
  HttpClientResponse,
  OneUpUserId,
  AppUserId,
  UserActive,
  Query,
  PatientId,
  FHIRVersion,
  QueryParams,
  Config,
} from './types/main';
import HttpClient from './http-client';
import Validator from './validator';
import { FHIR_DSTU2 } from './types/fhir-dstu2';
import { FHIR_STU3 } from './types/fhir-stu3';

/**
 *
 *
 * @export
 * @class ApiSDK
 */
export default class ApiSDK {
  public clientId?: string;
  public clientSecret?: string;
  public accessToken?: string;
  public refreshToken?: string;

  /**
   *
   *
   * @type {string}
   * @memberof ApiSDK
   */
  public API_URL_BASE: string = 'https://api.1up.health';

  /**
   * Http client, abstraction over 'request' library
   *
   * @private
   * @type {HttpClient}
   * @memberof ApiSDK
   */
  private httpClient: HttpClient;

  /**
   * Creates an instance of ApiSDK.
   *
   * @param {Config} config
   * @memberof ApiSDK
   */
  public constructor(config?: Config) {
    if (config) {
      this.clientId = config['clientId'];
      this.clientSecret = config['clientSecret'];
    }
    this.httpClient = new HttpClient();
  }

  /**
   * **GET /user-management/v1/user**
   *
   * Get the list of all the users that exist inside your 1up Developer Application,
   * with the option of filtering by specific users
   *
   * @param {OneUpUserId} [oneUpUserId]
   * @param {AppUserId} [appUserId]
   * @returns {Promise<HttpClientResponse>}
   * An array of user objects
   * @memberof ApiSDK
   */
  public getUsers(
    oneUpUserId?: OneUpUserId,
    appUserId?: AppUserId,
  ): Promise<HttpClientResponse> {
    Validator.getUsersPayload(oneUpUserId, appUserId);
    Validator.clientKeys(this.clientKeys);
    return this.httpClient.get(`${this.API_URL_BASE}/user-management/v1/user`, {
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        ...(oneUpUserId ? { oneup_user_id: oneUpUserId } : {}),
        ...(appUserId ? { app_user_id: appUserId } : {}),
      },
    });
  }

  /**
   * **POST /user-management/v1/user**
   *
   * Will cause a user to be created with the attributes passed in the request body. \
   * The request won't fail if the user already exists but rather will return the user data but with
   *
   * @param {AppUserId} appUserId
   * @param {UserActive} userActive
   * @returns {Promise<HttpClientResponse>}
   * @memberof ApiSDK
   */
  public createUser(
    appUserId: AppUserId,
    userActive: UserActive,
  ): Promise<HttpClientResponse> {
    Validator.createUserPayload(appUserId, userActive);
    Validator.clientKeys(this.clientKeys);
    return this.httpClient.post(`${this.API_URL_BASE}/user-management/v1/user`, {
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        app_user_id: appUserId,
        active: userActive,
      },
    });
  }

  /**
   * **PUT /user-management/v1/user**
   *
   * Can be used to modify an existing user object. It is possible to modify the **app_user_id**,
   * but the **oneup_user_id** is assigned when the user is created and cannot be changed.
   *
   * @param {AppUserId} appUserId
   * @param {OneUpUserId} oneUpUserId
   * @param {UserActive} userActive
   * @returns {Promise<HttpClientResponse>}
   * Will return the new user object
   * @memberof ApiSDK
   */
  public updateUser(
    appUserId: AppUserId,
    oneUpUserId: OneUpUserId,
    userActive: UserActive,
  ): Promise<HttpClientResponse> {
    Validator.updateUserPayload(appUserId, oneUpUserId, userActive);
    Validator.clientKeys(this.clientKeys);
    return this.httpClient.put(`${this.API_URL_BASE}/user-management/v1/user`, {
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        app_user_id: appUserId,
        oneup_user_id: oneUpUserId,
        active: userActive,
      },
    });
  }

  /**
   * **POST /user-management/v1/user/auth-code**
   *
   * A backend app can use this endpoint to get a new authorization code for a user. \
   * Note that this endpoint should not be called in a browser context because \
   * it would require exposing your app's secret key to users.
   *
   * @param {AppUserId} appUserId
   * @returns {Promise<HttpClientResponse>}
   * Returns an access token and a refresh token,
   * which can be used to authenticate requests made on behalf of the user.
   * @memberof ApiSDK
   */
  public generateUserAuthCode(
    appUserId: AppUserId,
  ): Promise<HttpClientResponse> {
    Validator.generateUserAuthCodePayload(appUserId);
    Validator.clientKeys(this.clientKeys);
    return this.httpClient.post(`${this.API_URL_BASE}/user-management/v1/user/auth-code`, {
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        app_user_id: appUserId,
      },
    });
  }

  /**
   * **GET /connect/marketplace**
   *
   * A common pattern is to ask the user to connect data from their health system to the app. \
   * This endpoint returns a simple html page that can be used as a starting point for walking \
   * the user through the data connect flow. For more details, \
   * read about the https://1up.health/dev/doc/connect-health-data-iframe.
   *
   * @returns {Promise<HttpClientResponse>}
   * This endpoint returns an html page and inline css that, when rendered, results in a UI for \
   * selecting which health care system the user would like to connect. The most common use of \
   * this is to render this endpoint in an iframe within the developers own app.
   * @memberof ApiSDK
   */
  public getHealthSystemPickerIFrame(): Promise<HttpClientResponse> {
    Validator.accessToken(this.accessToken);
    Validator.clientKeys(this.clientKeys);
    return this.httpClient.get(`${this.API_URL_BASE}/connect/marketplace`, {
      params: {
        client_id: this.clientId,
        access_token: this.accessToken,
      },
    });
  }

  /**
   * **GET /connect/system/provider**
   *
   * Used to run a text search on health systems, often for the purpose of allowing the user \
   * to find their health system's authorization portal.
   *
   * @param {Query} query
   * { query: string; } \
   * This is how you specify the text to search for. \
   * It can be a doctor's name, clinic, hospital, or address.
   * @returns {Promise<HttpClientResponse>}
   * The result will return a bundle of FHIR Organizations which contain the 1upHealth \
   * health system id and an extension with the logo of that org or health system. \
   * You can use that to direct the patient to the correct connect api url so the patient \
   * can authorize sharing of their medical data. \
   * See the official hl7 FHIR docs (https://www.hl7.org/fhir/bundle.html) \
   * for more information on how a FHIR bundle is structured.
   * @memberof ApiSDK
   */
  public searchConnectProvider(
    query: Query,
  ): Promise<HttpClientResponse> {
    Validator.accessToken(this.accessToken);
    return this.httpClient.get(`${this.API_URL_BASE}/connect/system/provider/search`, {
      headers: {
        ...this.httpClient.defaultOptions.headers,
        Authorization: `Bearer ${this.accessToken}`,
      },
      params: {
        q: query,
      },
    });
  }

  /**
   * **GET /connect/system/device**
   *
   * Currently 1upHealth allows importing data from either Fitbit, GoogleFit or Withings.
   *
   * @returns {Promise<HttpClientResponse>}
   * Returns a list of device types that can be used as sources.
   * @memberof ApiSDK
   */
  public getDevices(): Promise<HttpClientResponse> {
    Validator.clientKeys(this.clientKeys);
    return this.httpClient.get(`${this.API_URL_BASE}/connect/system/device`, {
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
      },
    });
  }

  /**
   * **GET /connect/system/clinical**
   *
   * Use this endpoint to query the full list of supported health systems. \
   * If your use-case would benefit from full-text search of providers on fields \
   * like name, address, or clinician names, then we recommend \
   * using the Provider Search endpoint instead.
   *
   * @returns {Promise<HttpClientResponse>}
   * @memberof ApiSDK
   */
  public getSupportedHealthSystems(): Promise<HttpClientResponse> {
    Validator.clientKeys(this.clientKeys);
    return this.httpClient.get(`${this.API_URL_BASE}/connect/system/clinical`, {
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
      },
    });
  }

  /**
   * **GET /fhir/{fhirVersion}/{resourceType}**
   *
   * Returns all matching FHIR resources for a resource type \
   * See also: \
   * FHIR versions and resources supported by 1upHealth
   * https://1up.health/dev/reference/fhir-resources \
   * The official HL7 FHIR docs
   * https://www.hl7.org/fhir
   *
   * This endpoint receives authentication in the form of a http bearer authenitcation header.
   *
   * @public
   * @param {FHIRVersion} fhirVersion
   * @param {(FHIR_DSTU2.ResourceTypeStr | FHIR_STU3.ResourceTypeStr)} resourceType
   * @param {QueryParams} queryParams
   * @returns {Promise<HttpClientResponse>}
   * A FHIR Bundle containing all the resources that match the query,
   * @memberof ApiSDK
   */
  public getFHIRResources(
    fhirVersion: FHIRVersion,
    resourceType: FHIR_DSTU2.ResourceTypeStr | FHIR_STU3.ResourceTypeStr,
    queryParams: QueryParams,
  ): Promise<HttpClientResponse> {
    Validator.accessToken(this.accessToken);
    const url = `${this.API_URL_BASE}/fhir/${fhirVersion}/${resourceType}`;
    return this.httpClient.get(url, {
      headers: {
        ...this.httpClient.defaultOptions.headers,
        Authorization: `Bearer ${this.accessToken}`,
      },
      params: {
        ...queryParams,
      },
    });
  }

  /**
   * **POST /fhir/{fhirVersion}/{resourceType}**
   *
   * Can be used to create a FHIR resource with a given type. \
   * See also: \
   * FHIR versions and resources supported by 1upHealth
   * https://1up.health/dev/reference/fhir-resources \
   * The official HL7 FHIR docs
   * https://www.hl7.org/fhir
   *
   * @param {FHIRVersion} fhirVersion
   * @param {(FHIR_DSTU2.ResourceTypeStr | FHIR_STU3.ResourceTypeStr)} resourceType
   * @param {(FHIR_DSTU2.Resource | FHIR_STU3.Resource)} resource
   * @returns {Promise<HttpClientResponse>}
   * A FHIR Resource containing all the attributes that were posted.
   * @memberof ApiSDK
   */
  public createFHIRResource(
    fhirVersion: FHIRVersion,
    resourceType: FHIR_DSTU2.ResourceTypeStr | FHIR_STU3.ResourceTypeStr,
    resource: FHIR_DSTU2.Resource | FHIR_STU3.Resource,
  ): Promise<HttpClientResponse> {
    Validator.accessToken(this.accessToken);
    const url = `${this.API_URL_BASE}/fhir/${fhirVersion}/${resourceType}`;
    return this.httpClient.post(url, {
      headers: {
        ...this.httpClient.defaultOptions.headers,
        Authorization: `Bearer ${this.accessToken}`,
      },
      data: {
        ...resource,
      },
    });
  }

  /**
   * **GET /fhir/{fhirVersion}/Patient/{patientId}/$everything**
   *
   * This endpoint returns a list of all known FHIR resources for a given patient. \
   * This is useful when transmitting batch data or getting the full patient history.
   *
   * @param {PatientId} patientId
   * @param {FHIRVersion} fhirVersion
   * @returns {Promise<HttpClientResponse>}
   * A FHIR Bundle containing all the resources that match the query
   * @memberof ApiSDK
   */
  public queryFHIREverything(
    patientId: PatientId,
    fhirVersion: FHIRVersion,
  ): Promise<HttpClientResponse> {
    Validator.accessToken(this.accessToken);
    const url =
      `${this.API_URL_BASE}/fhir/${fhirVersion}/Patient/${patientId}/$everything`;
    return this.httpClient.get(url, {
      headers: {
        ...this.httpClient.defaultOptions.headers,
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
  }

  /**
   * **PUT /fhir/dstu2/Patient/patientid/_permission/{oneUpUserId}**
   *
   * When making a request to the 1upHealth FHIR API using a user's **access_token**, \
   * the resources returned will be scoped to only the resources that the user has \
   * permissions to view. However, sometimes when building an app you might want to \
   * support the ability for users to grant access to other users to see certain records. \
   * This endpoint allows you to grant access to resources to arbitrary users.
   *
   * @param {OneUpUserId} oneUpUserId
   * @param {FHIRVersion} fhirVersion
   * @returns {Promise<HttpClientResponse>}
   * @memberof ApiSDK
   */
  public grantPermissions(
    oneUpUserId: OneUpUserId,
    fhirVersion: FHIRVersion,
  ): Promise<HttpClientResponse> {
    Validator.accessToken(this.accessToken);
    const url =
      `${this.API_URL_BASE}/fhir/${fhirVersion}/Patient/patientid/_permission/${oneUpUserId}`;
    return this.httpClient.put(url, {
      headers: {
        ...this.httpClient.defaultOptions.headers,
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
  }

  /**
   * **DELETE /fhir/dstu2/Patient/patientid/_permission/{oneUpUserId}**
   *
   * This endpoint allows you to remove permissions that have been granted to users to see \
   * other users' FHIR resources.
   *
   * @param {OneUpUserId} oneUpUserId
   * @param {FHIRVersion} fhirVersion
   * @returns {Promise<HttpClientResponse>}
   * @memberof ApiSDK
   */
  public revokePermissions(
    oneUpUserId: OneUpUserId,
    fhirVersion: FHIRVersion,
  ): Promise<HttpClientResponse> {
    Validator.accessToken(this.accessToken);
    const url =
      `${this.API_URL_BASE}/fhir/${fhirVersion}/Patient/patientid/_permission/${oneUpUserId}`;
    return this.httpClient.delete(url, {
      headers: {
        ...this.httpClient.defaultOptions.headers,
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
  }

  /**
   * **POST https://api.1up.health/fhir/oauth2/token**
   *
   * grant_type=authorization_code
   *
   * This method generates new access token for given **auth_code**
   *
   * @param {string} authCode
   * @returns {Promise<HttpClientResponse>}
   * @memberof ApiSDK
   */  
  // TODO: unit tests
  public generateOAuth2Token(authCode: string): Promise<HttpClientResponse> {
    Validator.clientKeys(this.clientKeys);
    return this.httpClient.post(`${this.API_URL_BASE}/fhir/oauth2/token`, {
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'authorization_code',
        code: authCode,
      },
    });
  }

  /**
   * **POST https://api.1up.health/fhir/oauth2/token**
   *
   * grant_type=refresh_token
   *
   * This method refresh access token for given **refresh_token** parameter
   *
   * @param {string} refreshToken
   * @returns {Promise<HttpClientResponse>}
   * @memberof ApiSDK
   */
  // TODO: unit tests
  public refreshOAuth2Token(refreshToken: string): Promise<HttpClientResponse> {
    Validator.clientKeys(this.clientKeys);
    return this.httpClient.post(`${this.API_URL_BASE}/fhir/oauth2/token`, {
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      },
    });
  }

  /**
   * This method generate **access_token** for given **app_user_id**. \
   * If there is no user with given **app_user_id**, it creates new one.
   *
   * @param {AppUserId} appUserId
   * @returns {Promise<HttpClientResponse>}
   * @memberof ApiSDK
   */
  // TODO: unit tests
  public async authenticate(appUserId: AppUserId): Promise<HttpClientResponse> {
    Validator.clientKeys(this.clientKeys);
    const users = await this.getUsers(undefined, appUserId);
    let authCode: string;
    if (users.entry[0] !== undefined) {
      const generatedAuthCode = await this.generateUserAuthCode(appUserId);
      authCode = generatedAuthCode.code;
    } else {
      const user = await this.createUser(appUserId, true);
      authCode = user.code;
    }
    const response = await this.generateOAuth2Token(authCode);
    this.accessToken = response.access_token;
    this.refreshToken = response.refresh_token;
    return response;
  }

  /**
   *
   *
   * @readonly
   * @private
   * @type {{
   *     clientId: Config['clientId'],
   *     clientSecret: Config['clientSecret'],
   *   }}
   * @memberof ApiSDK
   */
  private get clientKeys(): {
    clientId: Config['clientId'],
    clientSecret: Config['clientSecret'],
  } {
    return {
      clientId: this.clientId,
      clientSecret: this.clientSecret,
    };
  }
}
