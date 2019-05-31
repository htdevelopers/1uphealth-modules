import sinon from 'sinon';
import * as typemoq from 'typemoq';
import OneUpApiSDK from '../src/api-sdk';
import HttpClient from '../src/http-client';
import { HttpClientResponse, AppUserId, OneUpUserId } from '../dist/src/interfaces';
import { UserActive, Method } from '../src/interfaces';

describe('api-sdk', () => {
  it('can be initialized', () => {
    const oneUpSDK = new OneUpApiSDK({
      clientId: 'test',
      clientSecret: 'test',
    });
    expect(oneUpSDK).toBeInstanceOf(OneUpApiSDK);
  });

  describe('getUsers', () => {
    const sdkInstance = new OneUpApiSDK({
      clientId: 'test',
      clientSecret: 'test',
    });
    const responseMock = typemoq.Mock.ofType<HttpClientResponse>().object;

    it('should return json response', async () => {
      const mock = {
        ...responseMock,
        body: JSON.stringify({ test: 1 }),
      };
      const stub = sinon.stub(HttpClient.prototype, 'get').resolves(mock);
      expect(await sdkInstance.getUsers()).toEqual(mock);
      stub.restore();
    });

    it('should validate function args', async () => {
      const stub = sinon.stub(HttpClient.prototype, 'get').resolves({ ...responseMock });
      let errorCount = 0;

      const argArr = [
        { ...typemoq.Mock.ofType<Method.GetUsers>().object },
        typemoq.Mock.ofType<Method.GetUsers>().object,
        { ...typemoq.Mock.ofType<Method.GetUsers>().object, app_user_id: '' },
        { app_user_id: '', oneup_user_id: '' },
      ];

      await Promise.all(
        argArr.map(async (arg) => {
          try {
            await sdkInstance.getUsers(arg);
          } catch (_e) {
            errorCount += 1;
          }
        }),
      );

      stub.restore();
      expect(errorCount).toEqual(1);
    });
  });

  describe('createUser', () => {
    const sdkInstance = new OneUpApiSDK({
      clientId: 'test',
      clientSecret: 'test',
    });
    const responseMock = typemoq.Mock.ofType<HttpClientResponse>().object;

    it('should return json response', async () => {
      const mock = {
        ...responseMock,
        body: JSON.stringify({ test: 1 }),
      };
      const stub = sinon.stub(HttpClient.prototype, 'post').resolves(mock);
      expect(await sdkInstance.createUser({ active: false, app_user_id: 'test' })).toEqual(mock);
      stub.restore();
    });

    it('should validate function args', async () => {
      const stub = sinon.stub(HttpClient.prototype, 'post').resolves({ ...responseMock });
      let errorCount = 0;

      const argArr = [
        typemoq.Mock.ofType<Method.CreateUser>().object,
        { ...typemoq.Mock.ofType<Method.CreateUser>().object, app_user_id: '' },
        { active: true, app_user_id: '' },
      ];

      await Promise.all(
        argArr.map(async (arg) => {
          try {
            await sdkInstance.createUser(arg);
          } catch (_e) {
            errorCount += 1;
          }
        }),
      );

      stub.restore();
      expect(errorCount).toEqual(2);
    });
  });

  describe('updateUser', () => {
    const sdkInstance = new OneUpApiSDK({
      clientId: 'test',
      clientSecret: 'test',
    });
    const responseMock = typemoq.Mock.ofType<HttpClientResponse>().object;

    it('should return json response', async () => {
      const mock = {
        ...responseMock,
        body: JSON.stringify({ test: 1 }),
      };
      const stub = sinon.stub(HttpClient.prototype, 'put').resolves(mock);
      expect(
        await sdkInstance.updateUser({ active: false, app_user_id: 'test', oneup_user_id: 'test' }),
      ).toEqual(mock);
      stub.restore();
    });

    it('should validate function args', async () => {
      const stub = sinon.stub(HttpClient.prototype, 'put').resolves({ ...responseMock });
      let errorCount = 0;

      const argArr = [
        typemoq.Mock.ofType<Method.UpdateUser>().object,
        { ...typemoq.Mock.ofType<Method.UpdateUser>().object, app_user_id: '' },
        { active: true, app_user_id: '', oneup_user_id: '' },
      ];

      await Promise.all(
        argArr.map(async (arg) => {
          try {
            await sdkInstance.updateUser(arg);
          } catch (_e) {
            errorCount += 1;
          }
        }),
      );

      stub.restore();
      expect(errorCount).toEqual(2);
    });
  });

  describe('generateUserAuthCode', () => {
    const sdkInstance = new OneUpApiSDK({
      clientId: 'test',
      clientSecret: 'test',
    });
    const responseMock = typemoq.Mock.ofType<HttpClientResponse>().object;

    it('should return json response', async () => {
      const mock = {
        ...responseMock,
        body: JSON.stringify({ test: 1 }),
      };
      const stub = sinon.stub(HttpClient.prototype, 'post').resolves(mock);
      expect(
        await sdkInstance.generateUserAuthCode({ app_user_id: 'test' }),
      ).toEqual(mock);
      stub.restore();
    });

    it('should validate function args', async () => {
      const stub = sinon.stub(HttpClient.prototype, 'post').resolves({ ...responseMock });
      let errorCount = 0;

      const argArr = [
        typemoq.Mock.ofType<Method.GenerateUserAuthCode>().object,
        { ...typemoq.Mock.ofType<Method.GenerateUserAuthCode>().object, app_user_id: '' },
      ];

      await Promise.all(
        argArr.map(async (arg) => {
          try {
            await sdkInstance.generateUserAuthCode(arg);
          } catch (_e) {
            errorCount += 1;
          }
        }),
      );

      stub.restore();
      expect(errorCount).toEqual(1);
    });
  });

  describe('getHealthSystemPickerIFrame', () => {
    const sdkInstance = new OneUpApiSDK({
      clientId: 'test',
      clientSecret: 'test',
    });
    const responseMock = typemoq.Mock.ofType<HttpClientResponse>().object;

    it('should return html response', async () => {
      sdkInstance.accessToken = 'test';
      const mock = {
        ...responseMock,
        body: '<html></html>',
      };
      const stub = sinon.stub(HttpClient.prototype, 'get').resolves(mock);
      expect(
        await sdkInstance.getHealthSystemPickerIFrame(),
      ).toEqual(mock);
      stub.restore();
    });

    it('should throw error if accessToken is not provided', async () => {
      sdkInstance.accessToken = undefined;
      const stub = sinon.stub(HttpClient.prototype, 'get').resolves(responseMock);
      let error = 0;
      try {
        await sdkInstance.getHealthSystemPickerIFrame();
      } catch (e) {
        error += 1;
      }
      stub.restore();
      expect(error).toEqual(1);
    });
  });

  describe('searchConnectProvider', () => {
    const sdkInstance = new OneUpApiSDK({
      clientId: 'test',
      clientSecret: 'test',
    });
    const responseMock = typemoq.Mock.ofType<HttpClientResponse>().object;

    it('should throw error when accessToken is not provided', async () => {
      sdkInstance.accessToken = undefined;
      let error = 0;
      const stub = sinon.stub(HttpClient.prototype, 'get').resolves(responseMock);
      try {
        await sdkInstance.searchConnectProvider({ query: 'john' });
      } catch (e) {
        error += 1;
      }
      stub.restore();
      expect(error).toEqual(1);
    });

    it('should return json response', async () => {
      sdkInstance.accessToken = 'test';
      const mock = {
        ...responseMock,
        body: JSON.stringify({}),
      };
      const stub = sinon.stub(HttpClient.prototype, 'get').resolves(mock);
      const response = await sdkInstance.searchConnectProvider({ query: 'john' });
      expect(response).toEqual(mock);
      stub.restore();
    });
  });

  describe('getDevices', () => {
    const sdkInstance = new OneUpApiSDK({
      clientId: 'test',
      clientSecret: 'test',
    });
    const responseMock = typemoq.Mock.ofType<HttpClientResponse>().object;

    it('should return json response', async () => {
      const mock = {
        ...responseMock,
        body: JSON.stringify({}),
      };
      const stub = sinon.stub(HttpClient.prototype, 'get').resolves(mock);
      const response = await sdkInstance.getDevices();
      expect(response).toEqual(mock);
      stub.restore();
    });
  });
});
