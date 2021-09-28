const { default: axios } = require('axios');
const { cpf } = require('cpf-cnpj-validator');
const { v4: uuidv4 } = require('uuid');
const { CPV } = require('../src/cpv-sdk');

describe('CPV SDK', () => {
  beforeEach(() => {
    process.env.CPV_API_KEY = '56c1f1b8-9b5c-41cd-b8f7-872be3500ad3';
  });

  describe('init', () => {
    test('should initialize with correct api key', () => {
      const sut = CPV;

      const token = uuidv4();
      sut.init(token);

      expect(sut.apiKey).toBe(token);
    });

    test('should initialize with environment api key', () => {
      const token = uuidv4();
      process.env.CPV_API_KEY = token;
      const sut = CPV;
      sut.init();

      expect(sut.apiKey).toBe(token);
    });

    test('should initialize axios with correct data', () => {
      const sut = CPV;
      const createSpy = jest.spyOn(axios, axios.create.name);

      const token = uuidv4();
      sut.init(token);

      expect(createSpy).toHaveBeenCalledWith({
        baseURL: process.env.CPV_API_URL,
        headers: {
          'x-api-key': token,
        },
        timeout: 5000,
      });
    });

    test('should initialize axios with default base url if variable CPV_API_URL does not exist', () => {
      const sut = CPV;
      const createSpy = jest.spyOn(axios, axios.create.name);
      process.env.CPV_API_URL = '';
      const token = uuidv4();

      sut.init(token);

      expect(createSpy).toHaveBeenCalledWith({
        baseURL: 'https://api.cupomverde.com.br/api/prod/v2',
        headers: {
          'x-api-key': token,
        },
        timeout: 5000,
      });
    });

    test('should keep the correct axios instance', () => {
      const sut = CPV;
      const fakeAxiosInstance = jest.fn();
      jest.spyOn(axios, axios.create.name).mockReturnValueOnce(fakeAxiosInstance);

      const token = uuidv4();
      sut.init(token);

      expect(sut.httpClient).toBe(fakeAxiosInstance);
    });

    test('should not have Api-Key and throw UnhautorizedError ', () => {
      const sut = CPV;
      try {
        process.env.CPV_API_KEY = '';
        sut.init();
      } catch (e) {
        expect(e.name).toBe('UnauthorizedError');
        expect(e.message).toBe('API Key não foi informada por parâmetro ou por variavel de ambiente.');
      }
    });

    test('should throw ValidationError for not UUID api key', () => {
      const sut = CPV;
      try {
        sut.init('any_api_key');
      } catch (e) {
        expect(e.name).toBe('ValidationError');
        expect(e.message).toBe('API Key não é válida, informe uma Api Key válida.');
      }
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

      const documento = cpf.generate();
      await sut.enviarCupomFiscal('any_xml_cupom_fiscal', documento);

      expect(postSpy).toHaveBeenCalledWith('/integracao/upload', {
        xml: 'any_xml_cupom_fiscal',
        cpf: documento,
      });
    });

    test('should remove all non-numeric characters from cpf', async () => {
      const postSpy = jest.fn().mockResolvedValueOnce({
        status: 200,
        data: 'any_data',
      });
      jest.spyOn(axios, axios.create.name).mockReturnValueOnce({
        post: postSpy,
      });
      const sut = CPV;
      sut.init();

      const documento = cpf.generate(true);
      await sut.enviarCupomFiscal('any_xml_cupom_fiscal', documento);

      expect(postSpy).toHaveBeenCalledWith('/integracao/upload', {
        xml: 'any_xml_cupom_fiscal',
        cpf: documento.replace(/\D/g, ''),
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

      const result = await sut.enviarCupomFiscal('any_xml_cupom_fiscal', cpf.generate());

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

      const promise = sut.enviarCupomFiscal('any_xml_cupom_fiscal', cpf.generate());

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

      const promise = sut.enviarCupomFiscal('any_xml_cupom_fiscal', cpf.generate());

      await expect(promise).rejects.toThrow(expect.objectContaining({
        name: 'NotFoundError',
        message: 'any_message',
      }));
    });

    test('should throw ConflictError when API returns 409', async () => {
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

      const promise = sut.enviarCupomFiscal('any_xml_cupom_fiscal', cpf.generate());

      await expect(promise).rejects.toThrow(expect.objectContaining({
        name: 'ConflictError',
        message: 'any_message',
      }));
    });

    test('should throw ValidationError when API returns 422', async () => {
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

      const promise = sut.enviarCupomFiscal('any_xml_cupom_fiscal', cpf.generate());

      await expect(promise).rejects.toThrow(expect.objectContaining({
        name: 'ValidationError',
        message: 'any_message',
      }));
    });

    test('should throw UnexpectedError when API returns unmapped error', async () => {
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

      const promise = sut.enviarCupomFiscal('any_xml_cupom_fiscal', cpf.generate());

      await expect(promise).rejects.toThrow(expect.objectContaining({
        name: 'UnexpectedError',
        message: 'any_message',
      }));
    });

    test('should throw ValidationError when the XML is not provided', async () => {
      const sut = CPV;
      sut.init();
      try {
        await sut.enviarCupomFiscal(null, cpf.generate());
      } catch (e) {
        expect(e.name).toBe('ValidationError');
        expect(e.message).toBe('XML não informado.');
      }
    });

    test('should throw ValidationError when the cpfCliente is not provided', async () => {
      const sut = CPV;
      sut.init();
      try {
        await sut.enviarCupomFiscal('xml', null);
      } catch (e) {
        expect(e.name).toBe('ValidationError');
        expect(e.message).toBe('cpfCliente não informado, informe um cpf válido.');
      }
    });

    test('should throw ValidationError when the cpfCliente is invalid', async () => {
      const sut = CPV;
      sut.init();
      try {
        await sut.enviarCupomFiscal('xml', '00000000000');
      } catch (e) {
        expect(e.name).toBe('ValidationError');
        expect(e.message).toBe('cpfCliente inválido, informe um cpf válido.');
      }
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

      const promise = sut.cancelarCupomFiscal('any_chave_cupom_fiscal');

      await expect(promise).rejects.toThrow(expect.objectContaining({
        name: 'NotFoundError',
        message: 'any_message',
      }));
    });

    test('should throw UnexpectedError when API returns unmapped error', async () => {
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

      const promise = sut.cancelarCupomFiscal('any_chave_cupom_fiscal');

      await expect(promise).rejects.toThrow(expect.objectContaining({
        name: 'UnexpectedError',
        message: 'any_message',
      }));
    });

    test('should throw ValidationError when not provide chave', async () => {
      const sut = CPV;
      sut.init();
      try {
        await sut.cancelarCupomFiscal();
      } catch (e) {
        expect(e.name).toBe('ValidationError');
        expect(e.message).toBe('Chave não informada.');
      }
    });
  });
});
