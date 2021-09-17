const { default: axios } = require('axios');
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
   */
  init(apiKey) {
    this.apiKey = apiKey || process.env.CPV_API_KEY;
    this.httpClient = axios.create({
      baseURL: process.env.CPV_API_URL,
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
   * @throws {UnexpectedError}
   * É lançado caso ocorra um erro inesperado.
   */
  async enviarCupomFiscal(xmlCupomFiscal, cpfCliente) {
    try {
      await this.httpClient.post('/integracao/upload', {
        xml: xmlCupomFiscal,
        cpf: cpfCliente,
      });
    } catch (error) {
      this.handleAxiosError(error);
    }
  }

  handleAxiosError(axiosError) {
    const axiosErrorStatus = axiosError?.status;
    const axiosErrorMessage = axiosError?.data?.message;
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

    throw UnexpectedError();
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
   */
  async cancelarCupomFiscal(chaveCupomFiscal) {}
}

const CPV = new CPVSDK();

module.exports = {
  CPV,
};
