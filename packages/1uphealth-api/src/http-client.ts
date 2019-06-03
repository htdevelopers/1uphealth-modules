import { HttpClientOptions, HttpClientMethod, HttpClientResponse } from './types/main';
import request from 'request';

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
  private executeRequest(
    method: HttpClientMethod,
    uri: string,
    options?: HttpClientOptions,
  ): Promise<HttpClientResponse> {
    if (options && options.body && typeof options.body === 'object') {
      options.body = JSON.stringify(options.body);
      console.log(options.body);
    }
    return new Promise((resolve, reject) => {
      request[method](
        uri,
        Object.assign({}, this.defaultOptions, options),
        (error, response, body) => {
          return error ? reject(error) : resolve(this.buildResponse(response, body));
        },
      );
    });
  }

  /**
   *
   *
   * @private
   * @param {request.Response} response
   * @param {*} body
   * @returns {HttpClientResponse}
   * @memberof HttpClient
   */
  private buildResponse(response: request.Response, body: any): HttpClientResponse {
    return {
      body,
      status: response.statusCode,
      statusMessage: response.statusMessage,
      success: response.statusCode < 400,
    };
  }
}
