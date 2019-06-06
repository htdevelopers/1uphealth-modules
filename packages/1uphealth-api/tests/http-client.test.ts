import sinon from 'sinon';
import axios, { AxiosResponse, AxiosPromise, AxiosRequestConfig } from 'axios';
import * as typemoq from 'typemoq';
import HttpClient from '../src/http-client';

describe('http-client', () => {
  const responseMock = typemoq.Mock.ofType<AxiosResponse>().object;
  let stubs: any[] = [];

  beforeAll(() => {
    stubs = [
      sinon.stub(axios, 'get').resolves({
        ...responseMock,
        status: 200,
        data: [],
      }),
      sinon.stub(axios, 'post').resolves({
        ...responseMock,
        status: 200,
        data: { success: true },
      }),
    ];
  });

  afterAll(() => {
    stubs.forEach(x => x.restore());
  });

  it('can be initialized', () => {
    const httpClient = new HttpClient();
    expect(httpClient).toBeInstanceOf(HttpClient);
  });

  it('get - returns correct reponse', async () => {
    const httpClient = new HttpClient();
    const response = await httpClient.get('http://test-nock-url.com');
    expect(response).toEqual([]);
  });

  it('post - returns correct reponse with provided body', async () => {
    const httpClient = new HttpClient();
    const response = await httpClient.post('http://test-nock-url.com', { data: { test: 'test' } });
    expect(response).toEqual({ success: true });
  });

  it('post - returns correct reponse without provided body', async () => {
    const httpClient = new HttpClient();
    const response = await httpClient.post('http://test-nock-url.com', {});
    expect(response).toEqual({ success: true });
  });
});
