import sinon from 'sinon';
import axios, { AxiosResponse } from 'axios';
import * as typemoq from 'typemoq';
import HttpClient from '../src/http-client';

describe('http-client', () => {
  const responseMock = typemoq.Mock.ofType<AxiosResponse>().object;

  beforeAll(() => {
    const stub1 = sinon.stub(axios, 'get').resolves({
      ...responseMock,
      status: 200,
      data: [],
    });
    const stub2 = sinon.stub(axios, 'post').resolves({
      ...responseMock,
      status: 200,
      data: { success: true },
    });
  });

  it('can be initialized', () => {
    const httpClient = new HttpClient();
    expect(httpClient).toBeInstanceOf(HttpClient);
  });

  it('get - returns correct reponse', async () => {
    const httpClient = new HttpClient();
    const response = await httpClient.get('http://test-nock-url.com');
    expect(response.status).toEqual(200);
    expect(response.data).toEqual([]);
  });

  it('post - returns correct reponse with provided body', async () => {
    const httpClient = new HttpClient();
    const response = await httpClient.post('http://test-nock-url.com', { data: { test: 'test' } });
    expect(response.status).toEqual(200);
    expect(response.data).toEqual({ success: true });
  });

  it('post - returns correct reponse without provided body', async () => {
    const httpClient = new HttpClient();
    const response = await httpClient.post('http://test-nock-url.com', {});
    expect(response.status).toEqual(200);
    expect(response.data).toEqual({ success: true });
  });
});
