---
title: Local2Coin
description: Accept cards and local payment methods for single-user businesses, AI agents, and marketplaces, with final settlement in Bitcoin, USDT, or USDC.
subtitle: Cards & Local Payments to Bitcoin and Stablecoins
slug: local-2-coin
serviceType: product
tags:
  - fiat to bitcoin settlement
  - fiat to stablecoin settlement
  - card to BTC settlement
  - card to USDT settlement
  - local payments to Bitcoin
  - local payments to stablecoins
  - marketplace payment infrastructure
  - privacy-first marketplace payments
  - self-custodial settlement
  - MIT licensed payment infrastructure
  - BTCPay Server
  - Aqua Wallet
  - Mono2Multi
---

## Local2Coin

Local2Coin helps single-user businesses, AI agents, marketplaces, and high-friction operators accept cards and local payment methods while settling value in Bitcoin, USDT, or USDC.

It is the inbound direction of the P2Pagos stack:

```txt
cards / local payments / marketplace payments → Bitcoin / USDT / USDC settlement
```

The goal is not to add another payment button. The goal is to create a payment flow where the customer pays with the method available to them, while the merchant, creator, or final recipient receives Bitcoin or stablecoins through a documented, rail-aware, and privacy-conscious process.

Local2Coin is built for operators that cannot depend on one processor, one bank, one account, one country, or one settlement rail.

## Current focus

Local2Coin is currently focused on:

- single-user businesses
- AI agents without traditional business accounts
- creator platforms
- digital service platforms
- high-friction but lawful businesses
- operators exposed to card declines
- operators blocked by traditional processor onboarding
- marketplaces that need privacy-preserving payment flows

## Two deployment options

**[`/mono`](https://github.com/P2Pagos/mono) — MIT licensed, self-hostable.**
Single-user orchestrator. The default starting point for individual operators, AI agents, and small businesses. Fork it, run it, customize it.

**`/marketplace` — Closed-source, managed.**
Multi-user marketplace layer built on top of `/mono`. For platforms that need user management, white-label flows, membership plans, KYC triggers, and dedicated managed infrastructure.

## What Local2Coin solves

Traditional payment processors often fail before the business reaches the customer.

The common problems are:

- rejected onboarding
- unsupported countries
- high card decline rates
- false positives
- processor dependency
- chargeback exposure
- limited settlement options
- forced disclosure of sensitive merchant data
- blocked or frozen accounts
- lack of backup rails

Local2Coin solves this by separating the customer payment method from merchant settlement.

The customer pays through the available card, local, marketplace, or fiat method. The merchant, creator, or final recipient settles in Bitcoin or stablecoins through a controlled, documented, and rail-aware flow.

## Managed support

Local2Coin is a managed service.

We support the end customer during payment execution and support the merchant or marketplace across the technical, operational, and documentation process.

Support can include:

- customer payment guidance
- merchant onboarding
- creator onboarding flow design
- wallet setup
- BTCPay Server setup
- marketplace instance setup
- membership plan configuration
- settlement flow configuration
- local rail coordination
- payment status follow-up
- transaction documentation
- source-of-funds support where needed
- operational troubleshooting
- compliance support with intermediary services that form part of the rail

The objective is to make the payment easier to complete, easier to document, and easier to explain.

## Mono2Multi approach

Local2Coin follows the Mono2Multi principle.

A production payment flow should not depend on a single processor, account, country, payment method, or settlement rail.

When a customer payment fails because of a false positive, blocked card, unsupported country, processor rule, local limitation, or verification mismatch, the business should have another route ready.

The usable rail and settlement path matter more than ideology.

## Privacy by architecture

Local2Coin is designed to reduce unnecessary exposure of sensitive personal or business data.

In marketplace flows, the buyer should not need access to the creator's real personal identity. The creator should not need access to unnecessary buyer data. The platform should not become the financial intermediary unless it has a clear legal and operational reason to do so.

The objective is data minimization, safer settlement, and cleaner separation between platform, customer, and creator.

This is especially important for marketplaces where privacy failures can create real personal safety risks.

## Implementation

Local2Coin can be implemented as:

- managed payment flow
- hosted checkout
- API integration
- marketplace payment module
- self-custodial settlement flow
- BTCPay Server-based setup
- white-label payment flow
- dedicated marketplace instance with membership plans

The first objective is always the same: make the payment work, protect the final recipient, document the flow, reduce unnecessary data exposure, and avoid single-rail dependency.

## Infrastructure reference

Technical reference for supported rails, settlement wallets, service modules, custodial modes, and architecture:

[→ Local2Coin infrastructure reference](/services/local-2-coin/infrastructure)
