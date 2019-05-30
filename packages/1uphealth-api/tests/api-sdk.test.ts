import sinon from 'sinon';
import * as typemoq from 'typemoq';
import OneUpApiSDK from '../src/api-sdk';
import HttpClient from '../src/http-client';
import { HttpClientResponse, AppUserId, OneUpUserId } from '../dist/src/interfaces';

describe('api-sdk', () => {
  it('can be initialized', () => {
    const oneUpSDK = new OneUpApiSDK({
      clientId: 'test',
      clientSecret: 'test',
    });
    expect(oneUpSDK).toBeInstanceOf(OneUpApiSDK);
  });

  describe('instance', () => {
    const sdkInstance = new OneUpApiSDK({
      clientId: 'test',
      clientSecret: 'tezt',
    });
    const responseMock = typemoq.Mock.ofType<HttpClientResponse>().object;

    it('getUsers, should return json response', async () => {
      const mock = {
        ...responseMock,
        body: JSON.stringify({ test: 1 }),
      };
      const stub = sinon.stub(HttpClient.prototype, 'get').resolves(mock);
      expect(await sdkInstance.getUsers()).toEqual(mock);
      stub.restore();
      expect((await sdkInstance.getUsers()).body).toBeDefined();
    });

    it('getUsers, should validate function args', async () => {
      const stub = sinon.stub(HttpClient.prototype, 'get').resolves({ ...responseMock });
      let errorCount = 0;

      const argArr = [
        { ...typemoq.Mock.ofType<OneUpUserId & AppUserId>().object },
        typemoq.Mock.ofType<OneUpUserId & AppUserId>().object,
        { ...typemoq.Mock.ofType<OneUpUserId & AppUserId>().object, app_user_id: '' },
        { app_user_id: '', oneup_user_id: '' },
      ];

      await Promise.all(argArr.map(async (arg) => {
        try {
          await sdkInstance.getUsers(arg);
        } catch (_e) {
          errorCount += 1;
        }
      }));

      stub.restore();
      expect(errorCount).toEqual(1);
    });
  });

});
