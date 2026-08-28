---
title: Local2Coin
description: Acepta tarjetas y métodos de pago locales para negocios individuales, agentes de IA y marketplaces, con liquidación final en Bitcoin o USDT.
subtitle: Tarjetas y Pagos Locales liquidados en Bitcoin y Stablecoins
slug: local-2-coin
serviceType: product
tags:
  - fiat a liquidación bitcoin
  - fiat a liquidación stablecoin
  - tarjeta a BTC
  - tarjeta a USDT
  - pagos locales a Bitcoin
  - pagos locales a stablecoins
  - infraestructura de pagos multi-canal
  - reducción de falsos positivos en pagos
  - liquidación self-custodial
  - infraestructura de pagos MIT
  - BTCPay Server
  - Aqua Wallet
  - Mono2Multi
---

## Local2Coin

Local2Coin comenzó como un proyecto de infraestructura personal para resolver un problema concreto: los operadores necesitan infraestructura de pago **antes** de tener la estructura corporativa, bancaria y de cumplimiento que exigen los procesadores tradicionales.

Está construido sobre software que usamos y publicamos nosotros mismos.

La **capa single-user** tiene licencia MIT, es self-hostable y está diseñada para una operación completamente autónoma — *sin intermediarios custodiales, sin requisitos de documentación, sin dependencias.*

La **capa multi-user** extiende la misma base para **operadores de marketplaces B2B**, self-custodial por diseño. Su licencia comercial financia el desarrollo continuo de la infraestructura open-source sobre la que se apoya.

*Construido sobre BTCPay Server, Aqua Wallet, Vue/Nuxt e Invopop.*

## El problema

Los procesadores de pago tradicionales exigen **documentación antes de que el proyecto haya sido validado**:

- Documentos societarios e historial operativo
- Explicación de flujos de transacción y evidencia de origen de fondos
- APIs propietarias, flujos custodiales y reglas que pueden cambiar sin previo aviso

Esto bloquea productos en etapa temprana, agentes de IA, pequeños operadores y *negocios legítimos que no encajan en la lógica de onboarding estándar*.

## La solución

> Un producto debería usar los mismos flujos de pago y lógica de API durante el desarrollo, las pruebas, el lanzamiento y el crecimiento.

PE'AHA utiliza módulos abiertos con rieles que pueden activarse o desactivarse sin reconstruir el producto. Empieza con costos más altos y liquidación más lenta — **mejora las tarifas, la velocidad y el volumen a medida que el negocio demuestra demanda**.

## Multi-canal con reducción de falsos positivos

Un pago legítimo puede fallar por razones fuera del control del operador: falso positivo, país no soportado, scoring de riesgo del procesador, regla del emisor de la tarjeta, restricción de proveedor único.

> Una arquitectura de un solo canal convierte ese fallo en una venta perdida.

Una arquitectura multi-canal le da al operador otra ruta. El objetivo no es eludir controles — es evitar depender de *un solo proveedor frágil, un solo banco, un solo país o un solo canal de liquidación*.

## Documentación

Para rieles técnicos, opciones de wallet, módulos de servicio y arquitectura:

[→ Documentación Local2Coin](/servicios/local-2-coin/documentation)
