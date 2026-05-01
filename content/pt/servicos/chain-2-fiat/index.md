---
title: Chain2Fiat — Bitcoin e Stablecoins para Fiat Local
subtitle: Infraestrutura de liquidação open source e self-custodial para empresas que precisam de fluxos de pagamento multi-rail práticos e movimentação internacional de dinheiro com mais flexibilidade.
---

P2Pagos usa [BTCPay Server](https://github.com/btcpayserver/btcpayserver) como backend e um fork da [Aqua Wallet](https://github.com/AquaWallet/aqua-wallet) como wallet de liquidação padrão.

[BTCPay Server](https://github.com/btcpayserver/btcpayserver) foi escolhido porque é um backend API e GUI testado em produção, amplamente adotado e mantido pela comunidade, com alguns rails já integrados. Também contribuímos ativamente para seu [core e ecossistema de plugins](https://github.com/search?q=involves%3Alearntheropes+%28org%3Abtcpayserver+OR+org%3Abtcpayserver-tether+OR+org%3Amempool%29&type=issues).

[Aqua Wallet](https://github.com/AquaWallet/aqua-wallet) foi escolhida porque já suporta liquidação em **BTC on-chain e múltiplas stablecoins (USD e BRL por enquanto)** por padrão, e pode ser integrada ao BTCPay Server por meio do protocolo Shamrock com um fluxo de conexão baseado em QR.

Onde o cashout local direto ainda não é nativo, P2Pagos oferece orientação prática sobre wallets externas, cartões e ferramentas de off-ramp compatíveis para melhorar a usabilidade real na América Latina e em outras regiões suportadas. Por exemplo, em todas as cadeias de liquidação atualmente planejadas, já consideramos wallets e serviços como [Belo](https://simple.belo.app/app/referral?referralCode=GIOVANNIL), [Revolut](https://revolut.com/referral/?referral-code=giovanni_learntheropes) e [Offramp](https://app.offramp.xyz/login?referralCode=njmlxf), incluindo caminhos compatíveis com cartão e Google Pay / Apple Pay, enquanto opções de cartão e Google Pay mais orientadas à privacidade poderão ser adicionadas mais adiante por meio do trabalho planejado com a API da FixedFloat ou por colaboração com o emissor.

---

## Abordagem de arquitetura de pagamentos multi-rail

P2Pagos é projetado em torno de algumas escolhas práticas:

- **Self-custodial por padrão**
- **Agnóstico na prática** — o rail utilizável e o caminho de liquidação importam mais do que a ideologia
- **Multi-rail por design** — mercados diferentes precisam de formas diferentes de pagar e sacar
- **Modular** — rails de entrada, offramps, fluxos e serviços podem ser habilitados ou deixados de fora conforme o caso de uso
- **Open source** — os componentes públicos permanecem sob licença MIT, com manutenção e desenvolvimento de longo prazo sustentados pela receita da oferta paga closed-source

Se um rail de entrada ainda não liquida diretamente em um ativo suportado pelo fork da Aqua Wallet, P2Pagos busca convertê-lo depois para o ativo suportado que seja mais barato e funcional para aquele caso.

---

## Arquitetura

O orquestrador principal ([/mono](https://github.com/P2Pagos/mono)) é licenciado MIT e reúne rails de entrada, fluxos de liquidação e serviços de suporte em um único workspace.

```mermaid
flowchart LR

subgraph walletWrap["/wallet (MIT)"]
  walletPlatform["Aqua fork (MIT)\niOS & Android"]
  seedMono["frase-semente"]
  seedMarket["frase-semente"]
  seedTeam["frase-semente / xpub"]
end

mono["/mono (MIT)"]
monoBtcpay["BTCPay Server (MIT)"]

subgraph docker["Docker"]
  marketplace["/marketplace\n(closed-source)\n\nRails:\n/banxa (MIT)\n\nServiços:\n/kyc (MIT)\n/compliance (MIT)"]
  marketBtcpay["BTCPay Server (MIT)"]
end

team["/team"]
otherWallet["/wallet (MIT)"]
builtMarket["baseado em"]
builtTeam["baseado em"]

dashboard["/dashboard (MIT)"]

seedMono --> mono
seedMarket --> marketplace
seedTeam -.-> team
otherWallet --> marketplace

mono --> monoBtcpay
marketplace --> marketBtcpay
dashboard --> otherWallet

marketplace -.-> builtMarket
builtMarket -.-> mono

team -.-> builtTeam
builtTeam -.-> mono
```

> O código do repo closed-source está disponível apenas para membros da equipe e não para colaboradores externos.
> Alguns módulos que só funcionam com o repo closed-source poderão ser publicados como open source em uma etapa posterior para integração em projetos de terceiros externos e não relacionados.
> Por ser um repo closed-source, ele exige verificação reforçada para o administrador do marketplace e para usuários envolvidos em transações de alto valor.
> Ele também deve gerar receita suficiente para manter todos os repos MIT no longo prazo.

---

## Rails de entrada multi-rail

| Rail | Status | Moeda | Métodos de pagamento | Liquidação | Taxa | Verificação |
|------|--------|-------|----------------------|------------|------|-------------|
| BTC | Implementado | SATS | On-chain & Lightning | Bitcoin on-chain | Nenhuma | Nenhuma |
| USDT | Implementado | USD | Liquid & Polygon | USDT Liquid & Polygon | Nenhuma | Nenhuma |
| [Peach](https://github.com/P2Pagos/mono/tree/main/rails/peach) *(p2p-api-integration)* | em testes | Global | Qualquer | Bitcoin on-chain | Alta | Nenhuma |
| [RoboSats](https://github.com/P2Pagos/mono/tree/main/rails/robosats) *(p2p-api-integration)* | em testes | Global | Qualquer | Bitcoin on-chain | Alta | Nenhuma |
| Mostro *(p2p-api-integration)* | em avaliação | Global | Qualquer | Bitcoin on-chain | Alta | Nenhuma |
| Guardarian *(cex-api-integration)* | planejado | USD, EUR, GBP, CAD, AUD, JPY, TRY, PLN, SEK | Cartões de crédito/débito & Google/Apple Pay | Bitcoin on-chain | Média | Reforçada |
| Paygate *(cex-api-integration)* | planejado | Global | Cartões de crédito/débito | USDT Polygon | Média | Nenhuma |
| DePix *(cex-api-integration)* | planejado | BRL | Pix | BRL na Liquid | Baixa | Nenhuma |
| Kamipay *(cex-api-integration)* | planejado | BRL | Pix | USDT Polygon | Baixa | Nenhuma |
| MtPelerin *(cex-api-integration)* | planejado | EUR & CHF | SEPA | Bitcoin on-chain OU USDT Polygon | Baixa | Padrão |
| Bitzed *(cex-api-integration)* | planejado | ZMW | Celular | Bitcoin on-chain | Baixa | Nenhuma |
| Matbea *(cex+p2p-api-integration)* | planejado | RUB | Yandex Pay, Sberbank, Tinkoff, YooMoney, SBP P2P, telefone celular | Bitcoin on-chain | Baixa | Nenhuma |

---

## Offramp multi-rail

| Cashout | Status | Moeda | Métodos de pagamento | Verificação |
|---------|--------|-------|----------------------|-------------|
| dLocal | estágio inicial | LATAM / África / Ásia & Oriente Médio | transferência bancária | padrão |
| Ueno Bank | após [moonshot.md](https://github.com/P2Pagos/mono/blob/main/moonshot.md) | PYG / USD | transferência bancária / popup de cartão | desconhecida, mas não inferior a padrão |
| Freedomia Card | em conversa com o provedor | liquidações limitadas em USD | cartão / Google Pay | nenhuma |

Código de indicação para dois meses do plano gratuito da [Freedomia](https://www.freedomia.io/a/p2pagos).

---

## Módulos de serviço

| Serviço | Status | Escopo | Propósito | Padrão |
|---------|--------|--------|-----------|--------|
| [ip-detection](https://github.com/P2Pagos/mono/tree/main/services/ip-detection) | em testes | global | geolocalização por IP e detecção de moeda | habilitado por padrão para detecção de moeda com base na localização por país da Cloudflare; ipinfo exige uma API key gratuita vitalícia |
| [tor](https://github.com/P2Pagos/mono/tree/main/services/tor) | em testes | global | reverse proxy Tor para integrações onion e baseadas em Tor | habilitado se consumido por um rail habilitado |
| [cors](https://github.com/P2Pagos/mono/tree/main/services/cors) | em testes | global | reverse proxy CORS para APIs de destino | habilitado se consumido por um rail habilitado |
| [market](https://github.com/P2Pagos/mono/tree/main/services/market) | em testes | global | agregação de mercado e ofertas externas | habilitado se consumido por um rail habilitado |
| invoice | planejado | múltiplos países, muitos deles na LATAM | geração programática de notas fiscais eletrônicas no momento da liquidação do pagamento, baseada na solução da [Invopop](https://www.invopop.com/), com a publicação da integração paraguaia SIFEN usando os módulos disponíveis da [TIPS SA](https://github.com/TIPS-SA) | desabilitado por padrão |

---

## Repositórios ativos e planejados

### [/mono](https://github.com/P2Pagos/mono)

Repositório MIT do orquestrador single-user.

Ele reúne rails de entrada, fluxos de liquidação e serviços de suporte em um único workspace. O desenvolvimento ativo está atualmente concentrado aqui.

### [/wallet](https://github.com/P2Pagos/wallet)

Fork MIT da Aqua Flutter Wallet para P2Pagos, com um app Nuxt embutido para gerenciar a configuração de /mono e conectar-se ao BTCPay por meio do protocolo Shamrock.

### /dashboard

App MIT baseado em Nuxt, pensado para gerenciar fluxos de pagamento por meio de uma interface embutida no app Flutter de /wallet.

### /marketplace

Repositório closed-source para integrações marketplace multi-user do repo /mono.

Ele foi projetado para incluir a gestão multi-user pelo administrador do marketplace, enquanto os fundos permanecem sempre sob controle do usuário merchant do marketplace.

Ele incluirá alguns módulos adicionais atualmente em avaliação:

#### Rails

- [Contas virtuais da Banxa](https://banxa.com/features/fiat/virtual-accounts/): rails ACH, SEPA, Faster Payments e PayID, todos a confirmar devido à documentação limitada, com dados únicos por merchant.

#### Serviços

- Verificação KYC de merchants.
- Relatórios de operações financeiras para clientes paraguaios conforme exigido pelas regras de compliance da Resolução DNIT 47/2026.
- Relatórios de operações financeiras para clientes da UE conforme exigido pela regulamentação MiCA.

---

## Primeiros casos de uso próximos

Alguns dos casos de uso mais claros já estão surgindo dentro da nossa rede imediata.

- Uma oportunidade com uma **empresa de construção** já está ativa por meio da Marta, com demanda real para receber pagamentos cripto de maior valor no Paraguai.
- Um **criador de conteúdo com audiência internacional no espaço de saúde e bem-estar** quer abrir uma agência para negócios locais que desejam se posicionar melhor no Google Maps, aparecer em featured snippets e gerenciar trabalho relacionado a DNS. Nesse fluxo, P2Pagos pode ser o método de pagamento, enquanto os negócios que pagam a ele podem estar localizados no Paraguai, na LATAM em geral ou até nas Filipinas.
- Durante um fim de semana recente no **Chaco**, outro contato italiano próximo descreveu duas linhas de negócio que se encaixam muito bem com nossa abordagem de pagamentos:
  - assistência com **trâmites paraguaios** como cédula, residência, carteira de motorista, certificado de vida e residência, e abertura de RUC
  - um **hostel low-cost para mochileiros e nômades digitais** que fazem reservas do exterior sem contas bancárias paraguaias locais

Alguns desses negócios podem ser considerados de alto risco por processadores de pagamento mainstream, mesmo quando não são inerentemente problemáticos. Nosso método de pagamento se encaixa bem justamente porque é settlement-first, internacional e menos dependente das limitações bancárias locais.

---

## Casos de uso para pagamentos multi-rail

P2Pagos é voltado para casos em que os stacks de pagamento padrão são limitados demais, frágeis demais ou dependentes demais de um único provedor.

Casos de uso típicos incluem:

- negócios internacionais
- negócios que precisam de rails de entrada multi-rail
- merchants que querem liquidação cripto com maior alcance de pagamentos
- usuários em mercados emergentes
- negócios de alto risco, mas lícitos
- builders que querem infraestrutura de pagamentos modular e self-hostable
- bitcoiners e entusiastas cripto

Ele não deve ser apresentado como uma solução universal para todo tipo de merchant.

---

## Status atual

P2Pagos ainda está evoluindo.

Alguns componentes existem como integrações funcionais, outros são parciais, experimentais ou ainda estão sendo reunidos dentro do orquestrador principal. Os repositórios devem ser lidos como trabalho ativo de infraestrutura, não como uma suíte de produtos finalizada.

---

## Comunidade & Contato

- [GitHub Discussions](https://github.com/orgs/P2Pagos/discussions)
- [Grupo do Telegram](https://t.me/P2Pagos)
- [p2pagos@p2pay.to](mailto:p2pagos@p2pay.to) com PGP opcional [A1786A2CF6C5B65FDB4519F17E425F745D4EE866](https://pgp.p2pay.to)

---

Projeto inspirado pelo [**BitPagos**](https://web.archive.org/web/20141229220849/https://www.bitpagos.com/pt/) em 2014, agora priorizado como uma resposta open source ao lançamento recente de um [Stripe Payments BTCPay Plugin](https://plugin-builder.btcpayserver.org/public/plugins/stripe-payments) com KYC obrigatório, disponibilidade limitada e liquidação em fiat.
