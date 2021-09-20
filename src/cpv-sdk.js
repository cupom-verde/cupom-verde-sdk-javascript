const { default: axios } = require('axios');
const { cpf } = require('cpf-cnpj-validator');
const { default: isUUID } = require('validator/lib/isUUID');
const {
  UnauthorizedError, NotFoundError, UnexpectedError, ConflictError, ValidationError,
} = require('./errors');

class CPVSDK {
  /**
   * Configura o SDK do Cupom Verde.
   * Todos os outros métodos do SDK precisam ser chamados após este.
   * @example
   * CPV.init('my_api_key')
   * @param {string} apiKey - Sua chave de api do Cupom Verde.
   * @throws {UnauthorizedError}
   * Caso a Api Key não tenha sido encontrada nas variaveis de ambiente ou no parametro da função.
   * @throws {ValidationError}
   * Caso a Api Key não seja um UUID válido.
   */
  init(apiKey) {
    this.apiKey = apiKey || process.env.CPV_API_KEY;
    if (!this.apiKey) {
      throw new UnauthorizedError('API Key não foi informada por parâmetro ou por variavel de ambiente.');
    }

    if (!isUUID(this.apiKey)) {
      throw new ValidationError('API Key não é válida, informe uma Api Key válida.');
    }

    this.httpClient = axios.create({
      baseURL: process.env.CPV_API_URL || 'https://api.cupomverde.com.br/api/v2',
      headers: {
        'x-api-key': this.apiKey,
      },
      timeout: 5000,
    });
  }

  /**
   * @typedef EnviarCupomFiscalResult
   * @property {string} chave Chave do cupom fiscal.
   * @property {("NAO_IMPRIMIR"|"REDUZIDO")} impressao
   * Tipo de impressão de cupom fiscal que deve ser adotada.
   * Se o tipo de impressão for "NAO_IMPRIMIR" o cupom fiscal não deve ser impresso.
   * Se o tipo de impressão for "REDUZIDO" deve ser impresso o cupom fiscal reduzido.
   * @property {string} mensagem Mensagem que o parceiro define para cada cupom emitido.
   */

  /**
   * Envia um cupom fiscal.
   * @example
   * CPV.enviarCupomFiscal("Q3Vwb21WZXJkZQ==", "00000000000")
   * // Para enviar um cupom anônimo basta não informar o CPF do cliente
   * CPV.enviarCupomFiscal("Q3Vwb21WZXJkZQ==")
   * @param {string} xmlCupomFiscal - XML do cupom fiscal codificado em Base64
   * @param {string} cpfCliente - CPF do cliente do cupom fiscal.
   * Para enviar um cupom fiscal anônimo basta não informar este dado.
   * @returns {Promise<EnviarCupomFiscalResult>} Retorna uma promise que resolve
   * com os dados necessários para a impressão (ou não) do cupom fiscal.
   * @throws {UnauthorizedError}
   * Api key precisa ser válida.
   * @throws {NotFoundError}
   * A loja do cupom fiscal precisa existir no Cupom Verde.
   * @throws {ConflictError}
   * Não podem ser enviados dois cupons fiscais com a mesma chave.
   * @throws {ValidationError}
   * - O XML do cupom fiscal e CPF do cliente precisam ser válidos.
   * - O XML do cupom fiscal não pode ser maior que 1 Mb.
   * - O XML não foi informado
   * @throws {UnexpectedError}
   * É lançado caso ocorra um erro inesperado.
   */
  async enviarCupomFiscal(xmlCupomFiscal, cpfCliente) {
    if (!xmlCupomFiscal) {
      throw new ValidationError('XML não informado.');
    }

    if (!cpfCliente) {
      throw new ValidationError('cpfCliente não informado, informe um cpf válido.');
    }

    if (cpfCliente && !cpf.isValid(cpfCliente)) {
      throw new ValidationError('cpfCliente inválido, informe um cpf válido.');
    }

    try {
      const { data } = await this.httpClient.post('/integracao/upload', {
        xml: xmlCupomFiscal,
        cpf: cpfCliente.replace(/\D/g, ''),
      });

      return data;
    } catch (error) {
      return this._handleAxiosError(error);
    }
  }

  /**
   * Muda o status de um cupom fiscal para cancelado
   * @example
   * CPV.cancelarCupomFiscal('00000000000000000000000000000000000000000000')
   * @param {string} chaveCupomFiscal - Chave do cupom fiscal
   * @returns {Promise} Retorna uma promise.
   * @throws {UnauthorizedError}
   * Api key precisa ser válida.
   * @throws {NotFoundError}
   * A loja do cupom fiscal precisa existir no Cupom Verde.
   * @throws {UnexpectedError}
   * É lançado caso ocorra um erro inesperado.
   * @throws {ValidationError}
   * Chave não informada.
   */
  async cancelarCupomFiscal(chaveCupomFiscal) {
    if (!chaveCupomFiscal) {
      throw new ValidationError('Chave não informada.');
    }
    try {
      await this.httpClient.post(`/integracao/cancelamentos/${chaveCupomFiscal}`);
    } catch (error) {
      this._handleAxiosError(error);
    }
  }

  _handleAxiosError(axiosError) {
    const axiosErrorStatus = axiosError?.response?.status;
    const axiosErrorMessage = axiosError?.response?.data?.message;
    const errorsByCode = {
      401: new UnauthorizedError(axiosErrorMessage),
      404: new NotFoundError(axiosErrorMessage),
      409: new ConflictError(axiosErrorMessage),
      422: new ValidationError(axiosErrorMessage),
    };

    const error = errorsByCode[axiosErrorStatus];

    if (error) {
      throw error;
    }

    throw new UnexpectedError(axiosErrorMessage);
  }
}

const CPV = new CPVSDK();

module.exports = {
  CPV,
};
