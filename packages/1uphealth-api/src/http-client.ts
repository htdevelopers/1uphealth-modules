import { HttpClientOptions, HttpClientMethod, HttpClientResponse } from './types/main';
// import request from 'request';
import axios, { AxiosResponse } from 'axios';

/**
 * HttpClient is helper abstraction over the request library.
 *
 * @export
 * @class HttpClient
 */
export default class HttpClient {
  /**
   *
   *
   * @type {HttpClientOptions}
   * @memberof HttpClient
   */
  public defaultOptions: HttpClientOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  /**
   *
   *
   * @param {string} uri
   * @param {HttpClientOptions} [options]
   * @returns {Promise<HttpClientResponse>}
   * @memberof HttpClient
   */
  public async get(uri: string, options?: HttpClientOptions): Promise<HttpClientResponse> {
    return this.executeRequest('get', uri, options);
  }

  /**
   *
   *
   * @param {string} uri
   * @param {HttpClientOptions} [options]
   * @returns {Promise<HttpClientResponse>}
   * @memberof HttpClient
   */
  public async post(uri: string, options?: HttpClientOptions): Promise<HttpClientResponse> {
    return this.executeRequest('post', uri, options);
  }

  /**
   *
   *
   * @param {string} uri
   * @param {HttpClientOptions} [options]
   * @returns {Promise<HttpClientResponse>}
   * @memberof HttpClient
   */
  public async patch(uri: string, options?: HttpClientOptions): Promise<HttpClientResponse> {
    return this.executeRequest('patch', uri, options);
  }

  /**
   *
   *
   * @param {string} uri
   * @param {HttpClientOptions} [options]
   * @returns {Promise<HttpClientResponse>}
   * @memberof HttpClient
   */
  public async put(uri: string, options?: HttpClientOptions): Promise<HttpClientResponse> {
    return this.executeRequest('put', uri, options);
  }

  /**
   *
   *
   * @param {string} uri
   * @param {HttpClientOptions} [options]
   * @returns {Promise<HttpClientResponse>}
   * @memberof HttpClient
   */
  public async delete(uri: string, options?: HttpClientOptions): Promise<HttpClientResponse> {
    return this.executeRequest('delete', uri, options);
  }

  /**
   *
   *
   * @private
   * @param {HttpClientMethod} method
   * @param {string} uri
   * @param {HttpClientOptions} [options]
   * @returns {Promise<HttpClientResponse>}
   * @memberof HttpClient
   */
  private async executeRequest(
    method: HttpClientMethod,
    uri: string,
    options?: HttpClientOptions,
  ): Promise<HttpClientResponse> {
    try {
      const response = await axios[method](uri, Object.assign({}, this.defaultOptions, options));
      this.checkAuthorizationResponse(response);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   *
   * @private
   * @param {AxiosResponse} response
   * @memberof HttpClient
   */
  private checkAuthorizationResponse(response: AxiosResponse): void {
    const { status, data } = response;
    const unathorizedStatuses = [300, 301, 302, 401, 403];

    if (
      unathorizedStatuses.includes(status) ||
      (typeof data === 'string' && data.includes('login-form'))
    ) {
      throw new Error(
        `Unauthorized. You are not allowed to access this resource. \
Make sure that access token or client keys were provide.d`,
      );
    }

    if (data.error) {
      throw new Error(data.error);
    }
  }
}
