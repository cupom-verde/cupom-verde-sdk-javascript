const { default: axios } = require('axios');
const { CPV } = require('../src/cpv-sdk');

describe('CPV SDK', () => {
  describe('init', () => {
    const createSpy = jest.spyOn(axios, axios.create.name);

    test('should initialize with correct api key', () => {
      const sut = CPV;

      sut.init('any_api_key');

      expect(sut.apiKey).toBe('any_api_key');
    });

    test('should initialize with environment api key', () => {
      const sut = CPV;

      sut.init();

      expect(sut.apiKey).toBe('cpv_api_key');
    });

    test('should initialize axios with correct data', () => {
      const sut = CPV;

      sut.init('any_api_key');

      expect(createSpy).toHaveBeenCalledWith({
        baseURL: process.env.CPV_API_URL,
        headers: {
          'x-api-key': 'any_api_key',
        },
        timeout: 5000,
      });
    });

    test('should keep the correct axios instance', () => {
      const sut = CPV;
      const fakeAxiosInstance = jest.fn();
      createSpy.mockReturnValueOnce(fakeAxiosInstance);

      sut.init('any_api_key');

      expect(sut.httpClient).toBe(fakeAxiosInstance);
    });
  });
});
