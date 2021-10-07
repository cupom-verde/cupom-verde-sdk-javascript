<h1 align="center">Bem-vindo ao cupom-verde-sdk 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.3-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/quickdata-team/cupom-verde-sdk-javascript#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/quickdata-team/cupom-verde-sdk-javascript/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/quickdata-team/cupom-verde-sdk-javascript/blob/master/LICENSE" target="_blank">
    <img alt="License: ISC" src="https://img.shields.io/github/license/quickdata-team/cupom-verde-sdk-javascript" />
  </a>
</p>

> SDK do Cupom Verde em JavaScript

### 🏠 [Homepage](https://github.com/quickdata-team/cupom-verde-sdk-javascript#readme)

## Instalação

### Npm

```sh
npm install cupom-verde-sdk --save
```

### Yarn

```sh
yarn add cupom-verde-sdk
```

## Inicializando o SDK

```javascript
const { CPV } = require('cupom-verde-sdk');

(async () => {
  // Caso não seja informada uma api key será utilizado
  // o valor da variável de ambiente CPV_API_KEY
  CPV.init(
    'a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e5e5e5' // Sua api key
  );
})();
```

## Enviando um cupom fiscal

```javascript
const { CPV } = require('cupom-verde-sdk');

(async () => {
  // Antes de utilizar qualquer outro método é
  // necessário inicializar o SDK
  CPV.init(
    'a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e5e5e5' // Sua api key
  );

  try {
    await CPV.enviarCupomFiscal(
      '<?xml version="1.0" encoding="UTF-8"?>', // XML do cupom fiscal
      '00000000000', // CPF do cliente do cupom fiscal
    );
  } catch(error) {
    const { name, message } = error;

    console.log(`${name}: ${message}`);
  }
})();
```

## Cancelando um cupom fiscal

```javascript
const { CPV } = require('cupom-verde-sdk');

(async () => {
  // Antes de utilizar qualquer outro método é
  // necessário inicializar o SDK
  CPV.init(
    'a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e5e5e5' // Sua api key
  );

  try {
    await CPV.cancelarCupomFiscal(
      '00000000000000000000000000000000000000000000' // Chave do cupom fiscal
    );
  } catch(error) {
    const { name, message } = error;

    console.log(`${name}: ${message}`);
  }
})();
```

## Capturando um erro específico

```javascript
const { CPV, UnauthorizedError } = require('cupom-verde-sdk');

(async () => {
  // Antes de utilizar qualquer outro método é
  // necessário inicializar o SDK
  CPV.init(
    'a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e5e5e5' // Sua api key
  );

  try {
    await CPV.cancelarCupomFiscal(
      '00000000000000000000000000000000000000000000' // Chave do cupom fiscal
    );
  } catch(error) {
    if (error instanceof UnauthorizedError) {
      console.log('Acesso não autorizado');
    } else {
      console.log('Ocorreu um erro');
    }
  }
})();
```

## Author

👤 **Cupom Verde**

* Website: quickdata.com.br
* Github: [@quickdata-team](https://github.com/quickdata-team)

## 🤝 Contribuindo

Contribuições, problemas e solicitações de recursos são bem-vindos!<br />Sinta-se à vontade para verificar a [página de issues](https://github.com/quickdata-team/cupom-verde-sdk-javascript/issues). Você também pode dar uma olhada no [guia de contribuição](https://github.com/quickdata-team/cupom-verde-sdk-javascript/blob/master/CONTRIBUTING.md).

## Mostre seu apoio

Dê um ⭐️ se este projeto te ajudou!

## 📝 Licença

Copyright © 2021 [Cupom Verde](https://github.com/quickdata-team).<br />
Este projeto é [ISC] (https://github.com/quickdata-team/cupom-verde-sdk-javascript/blob/master/LICENSE) licenciado.
