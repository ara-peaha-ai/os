---
title: Local2Coin
description: Aceite cartões e métodos de pagamento locais para negócios individuais, agentes de IA e marketplaces, com liquidação final em Bitcoin ou USDT.
subtitle: Cartões e Pagamentos Locais liquidados em Bitcoin e Stablecoins
slug: local-2-coin
serviceType: product
tags:
  - fiat para liquidação bitcoin
  - fiat para liquidação stablecoin
  - cartão para BTC
  - cartão para USDT
  - pagamentos locais para Bitcoin
  - pagamentos locais para stablecoins
  - infraestrutura de pagamentos multi-canal
  - redução de falsos positivos em pagamentos
  - liquidação self-custodial
  - infraestrutura de pagamentos MIT
  - BTCPay Server
  - Aqua Wallet
  - Mono2Multi
---

## Local2Coin

O Local2Coin começou como um projeto de infraestrutura pessoal para resolver um problema concreto: operadores precisam de infraestrutura de pagamento **antes** de ter a estrutura corporativa, bancária e de conformidade que os processadores tradicionais exigem.

É construído sobre software que usamos e publicamos nós mesmos.

A **camada single-user** tem licença MIT, é self-hostável e projetada para operação totalmente autônoma — *sem intermediários custodiais, sem requisitos de documentação, sem dependências.*

A **camada multi-user** estende a mesma base para **operadores de marketplaces B2B**, self-custodial por design. Sua licença comercial financia o desenvolvimento contínuo da infraestrutura open-source da qual depende.

*Construído sobre BTCPay Server, Aqua Wallet, Vue/Nuxt e Invopop.*

## O problema

Os processadores de pagamento tradicionais exigem **documentação antes que o projeto seja validado**:

- Documentos societários e histórico operacional
- Explicação de fluxos de transação e evidências de origem de fundos
- APIs proprietárias, fluxos custodiais e regras que podem mudar sem aviso

Isso bloqueia produtos em fase inicial, agentes de IA, pequenos operadores e *negócios legítimos que não se encaixam na lógica de onboarding padrão*.

## A solução

> Um produto deve usar os mesmos fluxos de pagamento e lógica de API durante o desenvolvimento, testes, lançamento e crescimento.

O PE'AHA usa módulos abertos com rails que podem ser ativados ou desativados sem reconstruir o produto. Comece com custos mais altos e liquidação mais lenta — **melhore as tarifas, a velocidade e o volume à medida que o negócio comprova demanda**.

## Multi-canal com redução de falsos positivos

Um pagamento legítimo pode falhar por razões fora do controle do operador: falso positivo, país não suportado, scoring de risco do processador, regra do emissor do cartão, restrição de provedor único.

> Uma arquitetura de canal único transforma esse falha em uma venda perdida.

Uma arquitetura multi-canal dá ao operador outra rota. O objetivo não é contornar controles — é evitar depender de *um único provedor frágil, um único banco, um único país ou um único canal de liquidação*.

## Documentação

Para rails técnicos, opções de carteira, módulos de serviço e arquitetura:

[→ Documentação Local2Coin](/servicos/local-2-coin/documentation)
