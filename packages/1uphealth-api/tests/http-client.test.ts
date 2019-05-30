import nock from 'nock';
import HttpClient from '../src/http-client';

describe('http-client', () => {
  beforeAll(() => {
    nock('http://test-nock-url.com')
      .get('/')
      .reply(200, []);

    nock('http://test-nock-url.com')
      .post('/', { test: 'test' })
      .reply(201, { success: true });

    nock('http://test-nock-url.com')
      .post('/')
      .reply(200, { success: true });
  });

  it('can be initialized', () => {
    const httpClient = new HttpClient();
    expect(httpClient).toBeInstanceOf(HttpClient);
  });

  it('handles incorrect requests', async () => {
    const httpClient = new HttpClient();
    let error = false;
    try {
      const url = 'incorrect_url';
      await httpClient.get(url);
    } catch (_e) {
      error = true;
    }
    expect(error).toBeTruthy();
  });

  it('get - returns correct reponse', async ()  => {
    const httpClient = new HttpClient();
    const response = await httpClient.get('http://test-nock-url.com');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(JSON.stringify([]));
  });

  it('post - returns correct reponse with provided body', async ()  => {
    const httpClient = new HttpClient();
    const response = await httpClient.post('http://test-nock-url.com', { body: { test: 'test' } });
    expect(response.status).toEqual(201);
    expect(response.body).toEqual(JSON.stringify({ success: true }));
  });

  it('post - returns correct reponse without provided body', async ()  => {
    const httpClient = new HttpClient();
    const response = await httpClient.post('http://test-nock-url.com', {});
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(JSON.stringify({ success: true }));
  });
});
