---
title: Local2Coin
description: Accept cards and local payment methods for single-user businesses, AI agents, and marketplaces, with final settlement in Bitcoin or USDT.
subtitle: Cards & Local Payments settled in Bitcoin and Stablecoins
slug: local-2-coin
serviceType: product
tags:
  - fiat to bitcoin settlement
  - fiat to stablecoin settlement
  - card to BTC settlement
  - card to USDT settlement
  - local payments to Bitcoin
  - local payments to stablecoins
  - multi-rail payment infrastructure
  - reduced false positives payments
  - false positive payment decline reduction
  - marketplace payment infrastructure
  - privacy-first marketplace payments
  - self-custodial settlement
  - MIT licensed payment infrastructure
  - BTCPay Server
  - Aqua Wallet
  - Mono2Multi
---

## Local2Coin

Local2Coin is the service that gave origin to the P2Pagos project.

It started as a personal infrastructure project developed over several years to solve a practical problem: modern businesses, marketplaces, creators, AI agents, and small operators often need payment infrastructure before they have the full corporate, banking, and compliance structure required by traditional processors.

Local2Coin is based on open-source principles.

The complete single-user solution is designed to remain MIT licensed, self-hostable, and user-friendly. This open layer is the foundation of `/mono`.

The ongoing development and maintenance of `/mono` is supported through the commercial license of `/marketplace`, the closed-source multi-user layer for self-custodial marketplace deployments.

## What it does

Local2Coin allows single users and marketplaces to accept card and local payments in a self-custodial manner, with final settlement in Bitcoin or USDT.

It consolidates local payments from different parts of the world into a single application with business functions such as electronic invoicing.

The objective is not only to accept payments.

The objective is to build payment infrastructure that can survive processor failures, false positives, unsupported countries, blocked accounts, card declines, and single-rail dependency.

## Built with open-source infrastructure

Local2Coin uses leading open-source infrastructure:

1. **BTCPay Server**  
   Used as the backend of the entire infrastructure and settlement layer.

2. **Aqua Wallet fork**  
   Used as the default mobile settlement wallet base, with planned Polygon support and replacement of Aqua’s marketplace interface with the P2Pagos `/dashboard` for managing `/mono` and pairing with BTCPay Server.

3. **Vue / Nuxt**  
   Used where possible because it is released and maintained by an independent international developer community rather than by a large corporate ecosystem.

4. **Open-source invoicing tools**  
   Electronic invoicing is planned around open-source-compatible solutions such as Invopop, with jurisdiction-specific modules added where needed.

## The problem

Any modern application is designed around the system it uses to manage funds.

The presence or absence of specific financial features can make entire business models possible or impossible.

Traditional commercial solutions usually have proprietary APIs, custodial flows, closed rules, and features that can change over time.

They also often require extensive documentation before a project has even been validated: company documents, transaction-flow explanations, source-of-funds evidence, compliance details, or operating history.

This can block early-stage products, small operators, young developers, AI agents, marketplaces, and lawful businesses that do not fit standard onboarding logic.

## The solution

A product should be able to use the same payment flows and the same API logic during development, testing, launch, and growth.

Most payment APIs are closed and custodial.

P2Pagos uses open modules where possible, with rails that can be activated or deactivated while preserving the underlying implementation.

This means the system can start working with higher costs, slower settlement, lower limits, or less efficient routes, and later improve exchange rates, settlement speed, volume capacity, and documentation depth without rebuilding the product.

The same implementation can test global demand first, then focus on more efficient local rails in the countries or markets where the business actually proves demand.

## Multi-rail with reduced false positives

Local2Coin is designed around multi-rail payment continuity.

A legitimate payment can fail because of a false positive, card issuer rule, unsupported country, processor risk score, verification mismatch, local limitation, or single provider restriction.

A single-rail architecture turns that failure into a lost sale.

A multi-rail architecture gives the operator another route.

The goal is not to bypass legitimate controls.

The goal is to avoid designing serious payment flows around one fragile provider, one bank, one country, one account, one payment method, or one settlement rail.

## First test project

Local2Coin is being tested on the number-one website by traffic in an industry that remains private for now.

The objective is to validate a technological and legal structure that can be replicated across the broader sector.

## Documentation

For technical rails, wallet options, service modules, custodial modes, and architecture:

[→ Local2Coin documentation](/services/local-2-coin/documentation)