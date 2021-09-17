const { default: axios } = require('axios');
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

    test('should initialize axios with correct data', () => {
      const sut = CPV;
      const createSpy = jest.spyOn(axios, axios.create.name);

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
      jest.spyOn(axios, axios.create.name).mockReturnValueOnce(fakeAxiosInstance);

      sut.init('any_api_key');

      expect(sut.httpClient).toBe(fakeAxiosInstance);
    });
  });

  describe('enviarCupomFiscal', () => {
    test('should call axios with correct data', async () => {
      const postSpy = jest.fn();
      jest.spyOn(axios, axios.create.name).mockReturnValueOnce({
        post: postSpy,
      });
      const sut = CPV;
      sut.init();

      await sut.enviarCupomFiscal('any_xml_cupom_fiscal', 'any_cpf_cliente');

      expect(postSpy).toHaveBeenCalledWith('/integracao/upload', {
        xml: 'any_xml_cupom_fiscal',
        cpf: 'any_cpf_cliente',
      });
    });
  });
});
