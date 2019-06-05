// TODO: Handle 302 anauthorized redirection in all endpoints.
// TODO: validation using io-ts?

import {
  Config,
  Auth,
  HttpClientResponse,
  MethodArg,
  Scope,
} from './types/main';
import HttpClient from './http-client';
import Validator from './validator';

/**
 *
 *
 * @export
 * @class ApiSDK
 * @implements {Config}
 * @implements {Auth}
 * @implements {Scope.UserManagement}
 * @implements {Scope.UI}
 * @implements {Scope.Connect}
 */
export default class ApiSDK
  implements Config, Auth, Scope.Connect, Scope.FHIR, Scope.UI, Scope.UserManagement {
  /**
   *
   *
   * @type {Config['clientId']}
   * @memberof ApiSDK
   */
  public clientId: Config['clientId'];

  /**
   *
   *
   * @type {Config['clientSecret']}
   * @memberof ApiSDK
   */
  public clientSecret: Config['clientSecret'];

  /**
   *
   *
   * @type {string}
   * @memberof ApiSDK
   */
  public API_URL_BASE: string = 'https://api.1up.health';

  /**
   *
   *
   * @type {Auth['accessToken']}
   * @memberof ApiSDK
   */
  public accessToken: Auth['accessToken'];

  /**
   *
   *
   * @type {Auth['refreshToken']}
   * @memberof ApiSDK
   */
  public refreshToken: Auth['refreshToken'];

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
  // TODO: validate payload for Node.js
  public constructor(config?: Config) {
    if (config) {
      this.clientId = config['clientId'];
      this.clientSecret = config['clientSecret'];
      Validator.clientKeys(this.clientId, this.clientSecret);
    }
    this.httpClient = new HttpClient();
  }

  /**
   * **GET /user-management/v1/user**
   *
   * Get the list of all the users that exist inside your 1up Developer Application,
   * with the option of filtering by specific users
   *
   * @param {MethodArg.GetUsers} [parameters]
   * **oneup_user_id** — string \
   * **app_user_id** — string
   * @returns {Promise<HttpClientResponse>}
   * An array of user objects
   * @memberof ApiSDK
   */
  public async getUsers(parameters?: MethodArg.GetUsers): Promise<HttpClientResponse> {
    if (parameters !== undefined) {
      Validator.getUsersPayload(parameters);
    }
    Validator.clientKeys(this.clientId, this.clientSecret);
    return this.httpClient.get(`${this.API_URL_BASE}/user-management/v1/user`, {
      qs: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        ...(parameters
          ? {
            oneup_user_id: parameters.oneup_user_id,
            app_user_id: parameters.app_user_id,
          }
          : {}),
      },
    });
  }

  /**
   * **POST /user-management/v1/user**
   *
   * Will cause a user to be created with the attributes passed in the request body. \
   * The request won't fail if the user already exists but rather will return the user data but with
   *
   * @param {MethodArg.CreateUser} payload
   * @returns {Promise<HttpClientResponse>}
   * @memberof ApiSDK
   */
  public async createUser(payload: MethodArg.CreateUser): Promise<HttpClientResponse> {
    Validator.createUserPayload(payload);
    Validator.clientKeys(this.clientId, this.clientSecret);
    return this.httpClient.post(`${this.API_URL_BASE}/user-management/v1/user`, {
      qs: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        app_user_id: payload.app_user_id,
        active: payload.active,
      },
    });
  }

  /**
   * **PUT /user-management/v1/user**
   *
   * Can be used to modify an existing user object. It is possible to modify the **app_user_id**,
   * but the **oneup_user_id** is assigned when the user is created and cannot be changed.
   *
   * @param {MethodArg.UpdateUser} payload
   * @returns {Promise<HttpClientResponse>}
   * Will return the new user object
   * @memberof ApiSDK
   */
  public async updateUser(payload: MethodArg.UpdateUser): Promise<HttpClientResponse> {
    Validator.updateUserPayload(payload);
    Validator.clientKeys(this.clientId, this.clientSecret);
    return this.httpClient.put(`${this.API_URL_BASE}/user-management/v1/user`, {
      qs: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        app_user_id: payload.app_user_id,
        oneup_user_id: payload.oneup_user_id,
        active: payload.active,
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
   * @param {MethodArg.GenerateUserAuthCode} payload
   * @returns {Promise<HttpClientResponse>}
   * Returns an access token and a refresh token,
   * which can be used to authenticate requests made on behalf of the user.
   * @memberof ApiSDK
   */
  public async generateUserAuthCode(
    payload: MethodArg.GenerateUserAuthCode,
  ): Promise<HttpClientResponse> {
    Validator.generateUserAuthCodePayload(payload);
    Validator.clientKeys(this.clientId, this.clientSecret);
    return this.httpClient.post(`${this.API_URL_BASE}/user-management/v1/user/auth-code`, {
      qs: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        app_user_id: payload.app_user_id,
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
  public async getHealthSystemPickerIFrame(): Promise<HttpClientResponse> {
    Validator.accessToken(this.accessToken);
    Validator.clientKeys(this.clientId, this.clientSecret);
    return this.httpClient.get(`${this.API_URL_BASE}/connect/marketplace`, {
      qs: {
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
   * @param {MethodArg.SearchConnectProvider}
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
  public async searchConnectProvider(
    { query: q }: MethodArg.SearchConnectProvider,
  ): Promise<HttpClientResponse> {
    Validator.accessToken(this.accessToken);
    return this.httpClient.get(`${this.API_URL_BASE}/connect/system/provider/search`, {
      headers: {
        ...this.httpClient.defaultOptions.headers,
        Authorization: `Bearer ${this.accessToken}`,
      },
      qs: {
        q,
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
  public async getDevices(): Promise<HttpClientResponse> {
    Validator.clientKeys(this.clientId, this.clientSecret);
    return this.httpClient.get(`${this.API_URL_BASE}/connect/system/device`, {
      qs: {
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
  public async getSupportedHealthSystems(): Promise<HttpClientResponse> {
    Validator.clientKeys(this.clientId, this.clientSecret);
    return this.httpClient.get(`${this.API_URL_BASE}/connect/system/clinical`, {
      qs: {
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
   * @private
   * @param {MethodArg.GetFHIRResources} payload
   * @returns {Promise<HttpClientResponse>}
   * A FHIR Bundle containing all the resources that match the query,
   * @memberof ApiSDK
   */
  // TODO: input validation
  public async getFHIRResources(
    payload: MethodArg.GetFHIRResourcesDSTU2 | MethodArg.GetFHIRResourcesSTU3,
  ): Promise<HttpClientResponse> {
    Validator.accessToken(this.accessToken);
    const url = `${this.API_URL_BASE}/fhir/${payload.fhirVersion}/${payload.resourceType}`;
    return this.httpClient.get(url, {
      headers: {
        ...this.httpClient.defaultOptions.headers,
        Authorization: `Bearer ${this.accessToken}`,
      },
      qs: {
        ...payload.queryParams,
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
   * @param {(MethodArg.CreateFHIRResourceSTU3 | MethodArg.CreateFHIRResourceDSTU2)} payload
   * @returns {Promise<HttpClientResponse>}
   * A FHIR Resource containing all the attributes that were posted.
   * @memberof ApiSDK
   */
  // TODO: input validation
  public async createFHIRResource(
    payload: MethodArg.CreateFHIRResource,
  ): Promise<HttpClientResponse> {
    Validator.accessToken(this.accessToken);
    const url = `${this.API_URL_BASE}/fhir/${payload.fhirVersion}/${payload.resourceType}`;
    return this.httpClient.post(url, {
      headers: {
        ...this.httpClient.defaultOptions.headers,
        Authorization: `Bearer ${this.accessToken}`,
      },
      body: {
        ...payload.resource,
      },
    });
  }

  /**
   * **GET /fhir/{fhirVersion}/Patient/{patientId}/$everything**
   *
   * This endpoint returns a list of all known FHIR resources for a given patient. \
   * This is useful when transmitting batch data or getting the full patient history.
   *
   * @param {MethodArg.QueryFHIREverything} payload
   * @returns {Promise<HttpClientResponse>}
   * A FHIR Bundle containing all the resources that match the query
   * @memberof ApiSDK
   */
  // TODO: input validation
  public async queryFHIREverything(
    payload: MethodArg.QueryFHIREverything,
  ): Promise<HttpClientResponse> {
    Validator.accessToken(this.accessToken);
    const url =
      `${this.API_URL_BASE}/fhir/${payload.fhirVersion}/Patient/${payload.patientId}/$everything`;
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
   * @param {MethodArg.GrantPermissions} payload
   * @returns {Promise<HttpClientResponse>}
   * @memberof ApiSDK
   */
  public async grantPermissions(
    payload: MethodArg.GrantPermissions,
  ): Promise<HttpClientResponse> {
    Validator.accessToken(this.accessToken);
    const { fhirVersion, oneup_user_id } = payload;
    const url =
      `${this.API_URL_BASE}/fhir/${fhirVersion}/Patient/patientid/_permission/${oneup_user_id}`;
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
   * @param {MethodArg.RevokePermissions} payload
   * @returns {Promise<HttpClientResponse>}
   * @memberof ApiSDK
   */
  public async revokePermissions(
    payload: MethodArg.RevokePermissions,
  ): Promise<HttpClientResponse> {
    Validator.accessToken(this.accessToken);
    const { fhirVersion, oneup_user_id } = payload;
    const url =
      `${this.API_URL_BASE}/fhir/${fhirVersion}/Patient/patientid/_permission/${oneup_user_id}`;
    return this.httpClient.delete(url, {
      headers: {
        ...this.httpClient.defaultOptions.headers,
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
  }
}
