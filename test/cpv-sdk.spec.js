const { CPV } = require('../src/cpv-sdk');

describe('CPV SDK', () => {
  describe('init', () => {
    test('should init with correct api key', () => {
      const sut = CPV;

      sut.init('any_api_key');

      expect(sut.apiKey).toBe('any_api_key');
    });
  });
});
