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
      const postSpy = jest.fn().mockResolvedValueOnce({
        status: 200,
        data: 'any_data',
      });
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

    test('should return correct data', async () => {
      const postSpy = jest.fn().mockResolvedValueOnce({
        status: 200,
        data: 'any_data',
      });
      jest.spyOn(axios, axios.create.name).mockReturnValueOnce({
        post: postSpy,
      });
      const sut = CPV;
      sut.init();

      const result = await sut.enviarCupomFiscal('any_xml_cupom_fiscal', 'any_cpf_cliente');

      expect(result).toBe('any_data');
    });

    test('should throw UnauthorizedError when API returns 401', async () => {
      const postSpy = jest.fn().mockRejectedValueOnce({
        response: {
          status: 401,
          data: {
            code: 'any_code',
            message: 'any_message',
          },
        },
      });
      jest.spyOn(axios, axios.create.name).mockReturnValueOnce({
        post: postSpy,
      });
      const sut = CPV;
      sut.init();

      const promise = sut.enviarCupomFiscal('any_xml_cupom_fiscal', 'any_cpf_cliente');

      await expect(promise).rejects.toThrow(expect.objectContaining({
        name: 'UnauthorizedError',
        message: 'any_message',
      }));
    });

    test('should throw NotFoundError when API returns 404', async () => {
      const postSpy = jest.fn().mockRejectedValueOnce({
        response: {
          status: 404,
          data: {
            code: 'any_code',
            message: 'any_message',
          },
        },
      });
      jest.spyOn(axios, axios.create.name).mockReturnValueOnce({
        post: postSpy,
      });
      const sut = CPV;
      sut.init();

      const promise = sut.enviarCupomFiscal('any_xml_cupom_fiscal', 'any_cpf_cliente');

      await expect(promise).rejects.toThrow(expect.objectContaining({
        name: 'NotFoundError',
        message: 'any_message',
      }));
    });

    test('should throw NotFoundError when API returns 409', async () => {
      const postSpy = jest.fn().mockRejectedValueOnce({
        response: {
          status: 409,
          data: {
            code: 'any_code',
            message: 'any_message',
          },
        },
      });
      jest.spyOn(axios, axios.create.name).mockReturnValueOnce({
        post: postSpy,
      });
      const sut = CPV;
      sut.init();

      const promise = sut.enviarCupomFiscal('any_xml_cupom_fiscal', 'any_cpf_cliente');

      await expect(promise).rejects.toThrow(expect.objectContaining({
        name: 'ConflictError',
        message: 'any_message',
      }));
    });

    test('should throw NotFoundError when API returns 422', async () => {
      const postSpy = jest.fn().mockRejectedValueOnce({
        response: {
          status: 422,
          data: {
            code: 'any_code',
            message: 'any_message',
          },
        },
      });
      jest.spyOn(axios, axios.create.name).mockReturnValueOnce({
        post: postSpy,
      });
      const sut = CPV;
      sut.init();

      const promise = sut.enviarCupomFiscal('any_xml_cupom_fiscal', 'any_cpf_cliente');

      await expect(promise).rejects.toThrow(expect.objectContaining({
        name: 'ValidationError',
        message: 'any_message',
      }));
    });

    test('should throw NotFoundError when API returns unmapped error', async () => {
      const postSpy = jest.fn().mockRejectedValueOnce({
        response: {
          status: 500,
          data: {
            code: 'any_code',
            message: 'any_message',
          },
        },
      });
      jest.spyOn(axios, axios.create.name).mockReturnValueOnce({
        post: postSpy,
      });
      const sut = CPV;
      sut.init();

      const promise = sut.enviarCupomFiscal('any_xml_cupom_fiscal', 'any_cpf_cliente');

      await expect(promise).rejects.toThrow(expect.objectContaining({
        name: 'UnexpectedError',
        message: 'any_message',
      }));
    });
  });

  describe('cancelarCupomFiscal', () => {
    test('should call axios with correct data', async () => {
      const postSpy = jest.fn().mockResolvedValueOnce({
        status: 200,
        data: 'any_data',
      });
      jest.spyOn(axios, axios.create.name).mockReturnValueOnce({
        post: postSpy,
      });
      const sut = CPV;
      sut.init();

      await sut.cancelarCupomFiscal('any_chave_cupom_fiscal');

      expect(postSpy).toHaveBeenCalledWith('/integracao/cancelamentos/any_chave_cupom_fiscal');
    });

    test('should throw UnauthorizedError when API returns 401', async () => {
      const postSpy = jest.fn().mockRejectedValueOnce({
        response: {
          status: 401,
          data: {
            code: 'any_code',
            message: 'any_message',
          },
        },
      });
      jest.spyOn(axios, axios.create.name).mockReturnValueOnce({
        post: postSpy,
      });
      const sut = CPV;
      sut.init();

      const promise = sut.cancelarCupomFiscal('any_chave_cupom_fiscal');

      await expect(promise).rejects.toThrow(expect.objectContaining({
        name: 'UnauthorizedError',
        message: 'any_message',
      }));
    });
  });
});
