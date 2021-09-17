const { CPV } = require('../src/cpv-sdk');

describe('CPV SDK', () => {
  describe('init', () => {
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
  });
});
