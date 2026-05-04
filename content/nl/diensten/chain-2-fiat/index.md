---
title: Coin2Local
description: Ontvang Bitcoin, USDT, USDC of stablecoin-betalingen van internationale klanten en consolideer liquiditeit in lokale fiat wanneer het bedrijf dit nodig heeft.
subtitle: Bitcoin & Stablecoins naar Lokale Fiat
slug: chain-2-fiat
serviceType: product
tags:
  - bitcoin to fiat settlement
  - stablecoin off-ramp
  - USDT settlement
  - USDC settlement
  - Paraguay business payments
  - real estate bitcoin payments
  - international investor payments
  - business off-ramp
  - multi-rail settlement
  - source of funds documentation
  - BTCPay Server
  - Mono2Multi
---

## Coin2Local

Coin2Local helpt bedrijven Bitcoin, USDT, USDC of stablecoin-betalingen te ontvangen van internationale klanten en de waarde te consolideren in lokale fiat-liquiditeit wanneer nodig.

Het is de uitgaande/lokale-liquiditeitsrichting van de P2Pagos-stack:

```txt
Bitcoin / USDT / USDC / stablecoins → lokale fiat-liquiditeit
```

Het doel is de klant of investeerder in staat te stellen te betalen met Bitcoin of stablecoins terwijl het lokale bedrijf blijft opereren met de fiat-liquiditeit die het nodig heeft voor leveranciers, loonlijst, belastingen, boekhouding, bankzaken en dagelijkse uitgaven.

Coin2Local is gebouwd voor bedrijven die praktische afwikkelingsuitvoering, documentatie, source-of-funds-ondersteuning en back-upkanalen nodig hebben in plaats van afhankelijkheid van één route.

## Huidige focus

Coin2Local richt zich momenteel op high-ticket bedrijven in Latijns-Amerika.

De eerste dedicated vertical zijn vastgoedbetalingen in Paraguay.

Meer informatie op `/diensten/chain-2-fiat/paraguay`.

## Richting

Coin2Local is de juiste stroom wanneer de betaler Bitcoin of stablecoins heeft en de handelaar lokale liquiditeit nodig heeft.

Voorbeelden:

```txt
USDC van buitenlandse investeerder → USD-liquiditeit in Paraguay
USDT van koper → lokale bankoverschrijving naar verkoper
Bitcoin-betaling → gedocumenteerde fiat-afwikkeling voor bedrijfsactiviteiten
stablecoin-betaling → lokale liquiditeit voor leveranciers, loonlijst of boekhouding
```

Het belangrijkste punt is niet alleen de conversie.

Het belangrijkste punt is de betaling bruikbaar maken voor het bedrijf.

## Voor wie

Coin2Local is gebouwd voor bedrijven die aan internationale klanten verkopen maar lokaal opereren.

Typische toepassingen zijn:

- vastgoedontwikkelaars
- bouwbedrijven
- vastgoedmakelaars
- eigenaren van onroerend goed
- vastgoedbeheermaatschappijen
- exporteurs
- professionele dienstverleners
- high-ticket handelaren
- bedrijven die internationale investeerders ontvangen
- bedrijven in landen waar traditionele grensoverschrijdende betalingen traag, duur of fragiel zijn

<ChainCountryList />

## Wat het oplost

Internationale betalingen mislukken vaak omdat de voorkeursbetaalmethode van de koper niet overeenkomt met de operationele behoeften van de handelaar.

De koper kan hebben:

- Bitcoin
- USDT
- USDC
- stablecoins
- offshore saldi
- internationale rekeningen
- beperkte toegang tot lokale betalingsrails

De handelaar kan nodig hebben:

- USD
- PYG
- EUR
- lokale bankliquiditeit
- kasliquiditeit
- leveranciersbetalingen
- boekhoudkundige registraties
- gedocumenteerde zakelijke afwikkeling

Coin2Local verbindt deze twee realiteiten.

## Documentatie en source of funds

Coin2Local is niet alleen een technische stroom.

Voor serieuze bedrijven moet de betaling ook verklaarbaar zijn.

Dat betekent de documentatie voorbereiden die nodig is wanneer een bank, tegenpartij, accountant, leverancier of lokale tussenpersoon vragen stelt.

Afhankelijk van het geval kan dit omvatten:

- verkoopcontracten
- facturen
- kopersidentificatie waar vereist
- betalingsreferenties
- source-of-funds-verklaring
- transactieregistraties
- afwikkelingsregistraties
- zakelijke rechtvaardiging
- boekhoudkundige ondersteuning
- route-uitleg
- documentatie voor lokale uitbetaling

Het doel is elke betaling gemakkelijker te ontvangen, uit te leggen en te verdedigen.

## Multi-rail offramp

Coin2Local is afhankelijk van offramp-uitvoering.

Een serieuze offramp-stroom kan niet afhankelijk zijn van één provider, één bank, één rekening, één kaart of één overboekingsroute.

De huidige en geplande offramp-tabel is:

| Uitbetaling | Status | Valuta | Betaalmethoden | Verificatie |
|-------------|--------|--------|----------------|-------------|
| dLocal | vroeg stadium | Latam / Afrika / Azië & Midden-Oosten | bankoverschrijving | Standaard |
| Ueno Bank | na moonshot | PYG / USD | bankoverschrijving / card-popup | Uitgebreid |
| Freedomia Card | in bespreking met de provider | USD beperkte afwikkelingen | kaart / Google Pay | Geen |

## Infrastructuur

P2Pagos gebruikt [BTCPay Server](https://github.com/btcpayserver/btcpayserver) als backend en een [Aqua Wallet](https://github.com/AquaWallet/aqua-wallet)-fork als standaard afwikkelingswallet.

BTCPay Server is gekozen omdat het een beproefde, breed geadopteerde en community-onderhouden API- en GUI-backend is met ingebouwde rails.

Aqua Wallet is gekozen omdat het al zelfbewarende afwikkeling ondersteunt in Bitcoin en Liquid-activa, inclusief USDT en DePix, met één seed phrase backup.

## Mono2Multi-aanpak

Coin2Local volgt het Mono2Multi-principe.

Een productie-afwikkelingsstroom mag niet afhankelijk zijn van één offramp, rekening, provider, bank, land, wallet, beurs of overboekingsroute.

Voor high-ticket betalingen zijn back-uprails niet optioneel. Ze maken deel uit van de architectuur.

## Tariefstelling

Tarieven zijn afhankelijk van de route, het land, het bedrag, het afwikkelingsactief en de urgentie.

Voor de vastgoed-vertical is het operationele doel:

- rond 0,5% waar praktisch voor gevalideerde routes
- nooit meer dan 4% voor de geplande algehele vastgoedoplossing
- minimaal twee beschikbare kanalen voor hetzelfde verzoek

## Implementatie

Coin2Local kan worden geïmplementeerd als:

- beheerde afwikkelingsstroom
- bedrijfsspecifieke offramp-route
- gedocumenteerde betalingsuitvoering
- vastgoedbetalingsstroom
- high-ticket betalingsondersteuning
- zelfbewarende afwikkelingsinstelling
- BTCPay Server-gebaseerde setup
- multi-rail afwikkelingsarchitectuur
- source-of-funds-vriendelijk betalingsproces

Het eerste doel is altijd hetzelfde: de Bitcoin- of stablecoin-betaling ontvangen, de route documenteren, zakelijke continuïteit behouden, lokale liquiditeit consolideren en afhankelijkheid van één rail vermijden.

## Gerelateerde vertical

De eerste dedicated Coin2Local-vertical zijn vastgoedbetalingen in Paraguay.

Meer informatie op `/real-estate`.
