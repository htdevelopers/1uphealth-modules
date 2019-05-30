import { HttpClientOptions, HttpClientMethod, HttpClientResponse } from './interfaces';
import request from 'request';

export default class HttpClient {
  private defaultOptions: HttpClientOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  public async get(uri: string, options?: HttpClientOptions): Promise<HttpClientResponse> {
    return this.executeRequest('get', uri, options);
  }

  public async post(uri: string, options?: HttpClientOptions): Promise<HttpClientResponse> {
    return this.executeRequest('post', uri, options);
  }

  public async patch(uri: string, options?: HttpClientOptions): Promise<HttpClientResponse> {
    return this.executeRequest('patch', uri, options);
  }

  public async put(uri: string, options?: HttpClientOptions): Promise<HttpClientResponse> {
    return this.executeRequest('put', uri, options);
  }

  public async delete(uri: string, options?: HttpClientOptions): Promise<HttpClientResponse> {
    return this.executeRequest('delete', uri, options);
  }

  private executeRequest(
    method: HttpClientMethod,
    uri: string,
    options?: HttpClientOptions,
  ): Promise<HttpClientResponse> {
    if (options && options.body && typeof options.body === 'object') {
      options.body = JSON.stringify(options.body);
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

  private buildResponse(response: request.Response, body: any): HttpClientResponse {
    return {
      body,
      status: response.statusCode,
      statusMessage: response.statusMessage,
      success: response.statusCode < 400,
    };
  }
}
