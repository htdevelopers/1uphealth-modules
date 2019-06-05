import sinon from 'sinon';
import * as typemoq from 'typemoq';
import ApiSDK from '../src/api-sdk';
import HttpClient from '../src/http-client';
import { MethodArg, HttpClientResponse } from '../src/types/main';

describe('api-sdk', () => {
  const responseMock = typemoq.Mock.ofType<HttpClientResponse>().object;

  it('can be initialized', () => {
    const oneUpSDK = new ApiSDK({
      clientId: 'test',
      clientSecret: 'test',
    });
    expect(oneUpSDK).toBeInstanceOf(ApiSDK);
  });

  describe('getUsers', () => {
    const sdkInstance = new ApiSDK({
      clientId: 'test',
      clientSecret: 'test',
    });

    it('should return json response', async () => {
      const mock = {
        ...responseMock,
        body: JSON.stringify({ test: 1 }),
      };
      const stub = sinon.stub(HttpClient.prototype, 'get').resolves(mock);
      const response = await sdkInstance.getUsers();
      expect(response).toEqual(mock);
      stub.restore();
    });

    it('should validate function args', async () => {
      const stub = sinon.stub(HttpClient.prototype, 'get').resolves({ ...responseMock });
      let errorCount = 0;

      const argArr = [
        { ...typemoq.Mock.ofType<MethodArg.GetUsers>().object },
        typemoq.Mock.ofType<MethodArg.GetUsers>().object,
        { ...typemoq.Mock.ofType<MethodArg.GetUsers>().object, app_user_id: '' },
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
    const sdkInstance = new ApiSDK({
      clientId: 'test',
      clientSecret: 'test',
    });

    it('should return json response', async () => {
      const mock = {
        ...responseMock,
        body: JSON.stringify({ test: 1 }),
      };
      const stub = sinon.stub(HttpClient.prototype, 'post').resolves(mock);
      const response = await sdkInstance.createUser({
        active: false,
        app_user_id: 'test',
      });
      expect(response).toEqual(mock);
      stub.restore();
    });

    it('should validate function args', async () => {
      const stub = sinon.stub(HttpClient.prototype, 'post').resolves({ ...responseMock });
      let errorCount = 0;

      const argArr = [
        typemoq.Mock.ofType<MethodArg.CreateUser>().object,
        { ...typemoq.Mock.ofType<MethodArg.CreateUser>().object, app_user_id: '' },
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
    const sdkInstance = new ApiSDK({
      clientId: 'test',
      clientSecret: 'test',
    });

    it('should return json response', async () => {
      const mock = {
        ...responseMock,
        body: JSON.stringify({ test: 1 }),
      };
      const stub = sinon.stub(HttpClient.prototype, 'put').resolves(mock);
      expect(
        await sdkInstance.updateUser(
          { active: false, app_user_id: 'test', oneup_user_id: 'test' },
        ),
      ).toEqual(mock);
      stub.restore();
    });

    it('should validate function args', async () => {
      const stub = sinon.stub(HttpClient.prototype, 'put').resolves({ ...responseMock });
      let errorCount = 0;

      const argArr = [
        typemoq.Mock.ofType<MethodArg.UpdateUser>().object,
        { ...typemoq.Mock.ofType<MethodArg.UpdateUser>().object, app_user_id: '' },
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
    const sdkInstance = new ApiSDK({
      clientId: 'test',
      clientSecret: 'test',
    });

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
        typemoq.Mock.ofType<MethodArg.GenerateUserAuthCode>().object,
        { ...typemoq.Mock.ofType<MethodArg.GenerateUserAuthCode>().object, app_user_id: '' },
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
    const sdkInstance = new ApiSDK({
      clientId: 'test',
      clientSecret: 'test',
    });

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
    const sdkInstance = new ApiSDK({
      clientId: 'test',
      clientSecret: 'test',
    });

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
    const sdkInstance = new ApiSDK({
      clientId: 'test',
      clientSecret: 'test',
    });

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

  describe('getSupportedHealthSystems', () => {
    const sdkInstance = new ApiSDK({
      clientId: 'test',
      clientSecret: 'test',
    });

    it('should return json response', async () => {
      const mock = {
        ...responseMock,
        body: JSON.stringify({}),
      };
      const stub = sinon.stub(HttpClient.prototype, 'get').resolves(mock);
      const response = await sdkInstance.getSupportedHealthSystems();
      expect(response).toEqual(mock);
      stub.restore();
    });
  });

  describe('createFHIRResource', () => {
    const sdkInstance = new ApiSDK({
      clientId: 'test',
      clientSecret: 'test',
    });

    it('should return json response', async () => {
      sdkInstance.accessToken = 'test';
      const stub = sinon.stub(HttpClient.prototype, 'post').resolves({ ...responseMock });
      const response = await sdkInstance.createFHIRResource({
        fhirVersion: 'dstu2',
        resource: {},
        resourceType: 'AllergyIntolerance',
      });
      expect(response).toEqual({ ...responseMock });
      stub.restore();
    });
  });

  describe('getFHIRResources', () => {
    const sdkInstance = new ApiSDK({
      clientId: 'test',
      clientSecret: 'test',
    });

    it('should return json response', async () => {
      sdkInstance.accessToken = 'test';
      const stub = sinon.stub(HttpClient.prototype, 'get').resolves({ ...responseMock });
      const response = await sdkInstance.getFHIRResources({
        fhirVersion: 'dstu2',
        resourceType: 'AllergyIntolerance',
        queryParams: {
          test: 'test',
        },
      });
      expect(response).toEqual({ ...responseMock });
      stub.restore();
    });
  });

  describe('queryFHIREverything', () => {
    const sdkInstance = new ApiSDK({
      clientId: 'test',
      clientSecret: 'test',
    });

    it('should return json response', async () => {
      sdkInstance.accessToken = 'test';
      const stub = sinon.stub(HttpClient.prototype, 'get').resolves({ ...responseMock });
      const response = await sdkInstance.queryFHIREverything({
        fhirVersion: 'dstu2',
        patientId: 'test',
      });
      expect(response).toEqual({ ...responseMock });
      stub.restore();
    });
  });

  describe('grantPermissions', () => {
    const sdkInstance = new ApiSDK({
      clientId: 'test',
      clientSecret: 'test',
    });

    it('should return json response', async () => {
      sdkInstance.accessToken = 'test';
      const stub = sinon.stub(HttpClient.prototype, 'put').resolves({ ...responseMock });
      const response = await sdkInstance.grantPermissions({
        fhirVersion: 'dstu2',
        oneup_user_id: '123',
      });
      expect(response).toEqual({ ...responseMock });
      stub.restore();
    });
  });

  describe('revokePermissions', () => {
    const sdkInstance = new ApiSDK({
      clientId: 'test',
      clientSecret: 'test',
    });

    it('should return json response', async () => {
      sdkInstance.accessToken = 'test';
      const stub = sinon.stub(HttpClient.prototype, 'delete').resolves({ ...responseMock });
      const response = await sdkInstance.revokePermissions({
        fhirVersion: 'dstu2',
        oneup_user_id: '123',
      });
      expect(response).toEqual({ ...responseMock });
      stub.restore();
    });
  });

  describe('clientKeys', () => {
    it('should return obj of client keys', () => {
      const api = new ApiSDK({
        clientId: 'test',
        clientSecret: 'test1',
      });
      expect(api['clientKeys']).toStrictEqual({
        clientSecret: 'test1',
        clientId: 'test',
      });
    });
  });
});
