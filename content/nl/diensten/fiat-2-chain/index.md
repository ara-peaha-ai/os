---
title: Fiat2Chain
description: Accepteer kaarten en lokale betaalmethoden voor eenmansbedrijven, AI-agenten en marktplaatsen, met definitieve afwikkeling in Bitcoin, USDT of USDC.
subtitle: Kaarten & Lokale Betalingen naar Bitcoin en Stablecoins
slug: fiat-2-chain
serviceType: product
tags:
  - fiat to bitcoin settlement
  - fiat to stablecoin settlement
  - card to BTC settlement
  - local payments to Bitcoin
  - local payments to stablecoins
  - marketplace payment infrastructure
  - self-custodial settlement
  - MIT licensed payment infrastructure
  - BTCPay Server
  - Aqua Wallet
  - Mono2Multi
---

## Fiat2Chain

Fiat2Chain helpt eenmansbedrijven, AI-agenten, marktplaatsen en high-friction operators kaarten en lokale betaalmethoden te accepteren terwijl de waarde wordt afgewikkeld in Bitcoin, USDT of USDC.

Het is de inkomende richting van de P2Pagos-stack:

```txt
kaarten / lokale betalingen / marktplaatsbetalingen → Bitcoin / USDT / USDC afwikkeling
```

Het doel is niet het toevoegen van nog een betaalknop. Het doel is een betalingsstroom te creëren waarbij de klant betaalt met de voor hem beschikbare methode, terwijl de handelaar, maker of eindontvangers Bitcoin of stablecoins ontvangt via een gedocumenteerd, rail-bewust en privacy-gericht proces.

Fiat2Chain is gebouwd voor operators die niet afhankelijk kunnen zijn van één processor, één bank, één rekening, één land of één afwikkelingsrail.

## Huidige focus

Fiat2Chain richt zich momenteel op:

- eenmansbedrijven
- AI-agenten zonder traditionele zakelijke rekeningen
- makerplatforms
- digitale serviceplatforms
- high-friction maar wettige bedrijven
- operators blootgesteld aan kaartafwijzingen
- operators geblokkeerd door traditionele processor-onboarding
- marktplaatsen die privacy-beschermende betalingsstromen nodig hebben

## MIT-gelicentieerde infrastructuur

Fiat2Chain is gebouwd op een open-source laag onderhouden door de [P2Pagos GitHub-organisatie](https://github.com/P2Pagos).

| Repository | Rol |
|------------|-----|
| [`/mono`](https://github.com/P2Pagos/mono) | Eén-gebruiker-orchestrator. Assembleert rails, stromen en infrastructuurservices in één Nuxt-werkruimte. |
| [`/wallet`](https://github.com/P2Pagos/wallet) | Mobiele zelfbewarende afwikkelingswallet gebaseerd op een Aqua Wallet-fork. Ondersteunt Bitcoin, Liquid en USDT. |
| `/dashboard` | Ingebedde mini-app voor betalingsstroombeheer en instellingen, toegankelijk vanuit de wallet. |

De MIT-laag kan zelf worden gehost, geforkeerd en aangepast. Het is de standaardfundament voor alle één-gebruiker- en kleine-operator-implementaties.

## B2B en marktplaatslaag

Operators die multi-gebruikersomgevingen, white-label betalingsstromen, KYC-triggers, lidmaatschapsplannen, compliance-modules of dedicated managed infrastructuur nodig hebben, gebruiken een closed-source laag gebouwd bovenop de MIT-basis.

| Laag | Type | Toepassing |
|------|------|------------|
| `/marketplace` | Closed-source | Multi-gebruiker marktplaatsplatform met gebruikersbeheer, betalingsoptiebeheer, lidmaatschapsplannen, maker-afwikkelingsconfiguratie en compliance-triggers. |
| Beheerde instanties | B2B-dienst | Dedicated implementaties die MIT- en closed-source lagen combineren met aangepaste railconfiguratie, onboarding-ondersteuning en operationele monitoring. |

## Wat Fiat2Chain oplost

Traditionele betalingsprocessors falen vaak voordat het bedrijf de klant bereikt.

Veelvoorkomende problemen zijn:

- afgewezen onboarding
- niet-ondersteunde landen
- hoge kaartafwijzingspercentages
- valse positieven
- processorafhankelijkheid
- chargebackrisico
- beperkte afwikkelingsopties
- gedwongen openbaarmaking van gevoelige handelaarsgegevens
- geblokkeerde of bevroren rekeningen
- gebrek aan back-uprails

Fiat2Chain lost dit op door de klantbetaalmethode te scheiden van de afwikkeling voor de handelaar.

De klant betaalt via de beschikbare kaart, lokale, marktplaats- of fiatmethode. De handelaar, maker of eindontvangers wikkelt af in Bitcoin of stablecoins via een gecontroleerd, gedocumenteerd en rail-bewust proces.

## Beheerde ondersteuning

Fiat2Chain is een beheerde dienst.

Wij ondersteunen de eindklant tijdens betalingsuitvoering en ondersteunen de handelaar of marktplaats gedurende het technische, operationele en documentatieproces.

Ondersteuning kan omvatten:

- klantbetalingsbegeleiding
- handelaarsonboarding
- maker-onboarding stroomontwerp
- wallet-instelling
- BTCPay Server-instelling
- marktplaatsinstantie-instelling
- lidmaatschapsplanconfiguratie
- afwikkelingsstroomconfiguratie
- lokale railcoördinatie
- betalingsstatusbewaking
- transactiedocumentatie
- source-of-funds-ondersteuning waar nodig
- operationele probleemoplossing
- complianceondersteuning met tussenliggende diensten die deel uitmaken van de rail

Het doel is de betaling gemakkelijker te voltooien, gemakkelijker te documenteren en gemakkelijker uit te leggen.

## Mono2Multi-aanpak

Fiat2Chain volgt het Mono2Multi-principe.

Een productiebetalingsstroom mag niet afhankelijk zijn van één processor, rekening, land, betaalmethode of afwikkelingsrail.

Wanneer een klantbetaling mislukt vanwege een vals positief, geblokkeerde kaart, niet-ondersteund land, processorregel, lokale beperking of verificatiemismatch, moet het bedrijf een andere route klaar hebben.

De bruikbare rail en het afwikkelingspad zijn belangrijker dan ideologie.

## Privacy door architectuur

Fiat2Chain is ontworpen om onnodige blootstelling van gevoelige persoonlijke of zakelijke gegevens te verminderen.

In marktplaatsstromen hoeft de koper geen toegang te hebben tot de echte persoonlijke identiteit van de maker. De maker hoeft geen toegang te hebben tot onnodige kopersgegevens. Het platform mag niet de financiële tussenpersoon worden tenzij er een duidelijke juridische en operationele reden voor is.

Het doel is dataminimalisatie, veiligere afwikkeling en een scheidere scheiding tussen platform, klant en maker.

Dit is vooral belangrijk voor marktplaatsen waar privacyfouten reële persoonlijke veiligheidsrisico's kunnen creëren.

## Implementatie

Fiat2Chain kan worden geïmplementeerd als:

- beheerde betalingsstroom
- gehoste checkout
- API-integratie
- marktplaatsbetalingsmodule
- zelfbewarende afwikkelingsstroom
- BTCPay Server-gebaseerde setup
- white-label betalingsstroom
- dedicated marktplaatsinstantie met lidmaatschapsplannen

Het eerste doel is altijd hetzelfde: de betaling laten werken, de eindontvangers beschermen, de stroom documenteren, onnodige gegevensblootstelling verminderen en afhankelijkheid van één rail vermijden.

## Infrastructuurreferentie

Technische referentie voor ondersteunde rails, afwikkelingswallets, servicemodules, bewaringsmodi en architectuur:

[→ Fiat2Chain infrastructuurreferentie](./infrastructure)
