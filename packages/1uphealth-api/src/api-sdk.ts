// TODO: Handle 302 anauthorized redirection in all endpoints..
// TODO: collect all endpoints to dict
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
 * @class OneUpApiSDK
 * @implements {Config}
 * @implements {Auth}
 * @implements {Scope.UserManagement}
 * @implements {Scope.UI}
 * @implements {Scope.Connect}
 */
export default class OneUpApiSDK
  implements Config, Auth, Scope.Connect, Scope.FHIR, Scope.UI, Scope.UserManagement {
  /**
   *
   *
   * @type {Config['clientId']}
   * @memberof OneUpApiSDK
   */
  public clientId: Config['clientId'];

  /**
   *
   *
   * @type {Config['clientSecret']}
   * @memberof OneUpApiSDK
   */
  public clientSecret: Config['clientSecret'];

  /**
   *
   *
   * @type {string}
   * @memberof OneUpApiSDK
   */
  public API_URL_BASE: string = 'https://api.1up.health';

  /**
   *
   *
   * @type {Auth['accessToken']}
   * @memberof OneUpApiSDK
   */
  public accessToken: Auth['accessToken'];

  /**
   *
   *
   * @type {Auth['refreshToken']}
   * @memberof OneUpApiSDK
   */
  public refreshToken: Auth['refreshToken'];

  /**
   * Http client, abstraction over 'request' library
   *
   * @private
   * @type {HttpClient}
   * @memberof OneUpApiSDK
   */
  private httpClient: HttpClient;

  /**
   * Creates an instance of OneUpApiSDK.
   *
   * @param {Config} config
   * @memberof OneUpApiSDK
   */
  public constructor(config: Config) {
    this.clientId = config['clientId'];
    this.clientSecret = config['clientSecret'];
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
   * @memberof OneUpApiSDK
   */
  public async getUsers(parameters?: MethodArg.GetUsers): Promise<HttpClientResponse> {
    if (parameters !== undefined) {
      Validator.getUsers(parameters);
    }
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
   * @memberof OneUpApiSDK
   */
  public async createUser(payload: MethodArg.CreateUser): Promise<HttpClientResponse> {
    Validator.createUser(payload);
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
   * @memberof OneUpApiSDK
   */
  public async updateUser(payload: MethodArg.UpdateUser): Promise<HttpClientResponse> {
    Validator.updateUser(payload);
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
   * @memberof OneUpApiSDK
   */
  public async generateUserAuthCode(
    payload: MethodArg.GenerateUserAuthCode,
  ): Promise<HttpClientResponse> {
    Validator.generateUserAuthCode(payload);
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
   * @memberof OneUpApiSDK
   */
  public async getHealthSystemPickerIFrame(): Promise<HttpClientResponse> {
    Validator.checkAccessToken(this.accessToken);
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
   * @memberof OneUpApiSDK
   */
  public async searchConnectProvider(
    { query: q }: MethodArg.SearchConnectProvider,
  ): Promise<HttpClientResponse> {
    Validator.checkAccessToken(this.accessToken);
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
   * @memberof OneUpApiSDK
   */
  public async getDevices(): Promise<HttpClientResponse> {
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
   * @memberof OneUpApiSDK
   */
  public async getSupportedHealthSystems(): Promise<HttpClientResponse> {
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
   * @memberof OneUpApiSDK
   */
  // TODO: unit tests
  // TODO: input validation
  public async getFHIRResources(
    payload: MethodArg.GetFHIRResourcesDSTU2 | MethodArg.GetFHIRResourcesSTU3,
  ): Promise<HttpClientResponse> {
    Validator.checkAccessToken(this.accessToken);
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
   * @memberof OneUpApiSDK
   */
  // TODO: unit tests
  // TODO: input validation
  public async createFHIRResource(
    payload: MethodArg.CreateFHIRResource,
  ): Promise<HttpClientResponse> {
    console.log('createFHIRResource');
    Validator.checkAccessToken(this.accessToken);
    console.log('this.accessToken', this.accessToken);
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
   * @memberof OneUpApiSDK
   */
  // TODO: unit tests
  // TODO: input validation
  public async queryFHIREverything(
    payload: MethodArg.QueryFHIREverything,
  ): Promise<HttpClientResponse> {
    Validator.checkAccessToken(this.accessToken);
    const url =
      `${this.API_URL_BASE}/fhir/${payload.fhirVersion}/Patient/${payload.patientId}/$everything`;
    return this.httpClient.get(url, {
      headers: {
        ...this.httpClient.defaultOptions.headers,
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
  }
}

const x = new OneUpApiSDK({
  clientId: 'test',
  clientSecret: 'test',
});
