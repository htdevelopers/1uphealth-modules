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

  private async executeRequest(
    method: HttpClientMethod,
    uri: string,
    options?: HttpClientOptions,
  ): Promise<HttpClientResponse> {
    try {
      const response = await axios[method](
        uri,
        Object.assign({}, this.defaultOptions, options),
      );
      return this.buildResponse(response);
    } catch (error) {
      throw error;
    }
  }

  private buildResponse(response: AxiosResponse): HttpClientResponse {
    return {
      data: response.data,
      status: response.status,
      statusMessage: response.statusText,
    };
  }
}
