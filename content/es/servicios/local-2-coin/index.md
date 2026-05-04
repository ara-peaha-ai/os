---
title: Fiat2Chain
description: Acepta tarjetas y métodos de pago locales para negocios individuales, agentes de IA y marketplaces, con liquidación final en Bitcoin, USDT o USDC.
subtitle: Fiat Local a Bitcoin y Stablecoins
slug: fiat-2-chain
serviceType: product
tags:
  - fiat a liquidación bitcoin
  - fiat a liquidación stablecoin
  - tarjeta a BTC
  - tarjeta a USDT
  - pagos locales a Bitcoin
  - pagos locales a stablecoins
  - infraestructura de pagos marketplace
  - pagos marketplace con privacidad
  - liquidación self-custodial
  - infraestructura de pagos MIT
  - BTCPay Server
  - Aqua Wallet
  - Mono2Multi
---

## Fiat2Chain

Fiat2Chain ayuda a negocios individuales, agentes de IA, marketplaces y operadores de alto riesgo a aceptar tarjetas y métodos de pago locales liquidando el valor en Bitcoin, USDT o USDC.

Es la dirección entrante del stack P2Pagos:

```txt
tarjetas / pagos locales / pagos de marketplace → liquidación en Bitcoin / USDT / USDC
```

El objetivo no es agregar otro botón de pago. El objetivo es crear un flujo donde el cliente paga con el método que tiene disponible, mientras el merchant, creador o destinatario final recibe Bitcoin o stablecoins a través de un proceso documentado, consciente del canal y respetuoso de la privacidad.

Fiat2Chain está construido para operadores que no pueden depender de un solo procesador, banco, cuenta, país o canal de liquidación.

## Enfoque actual

Fiat2Chain está enfocado actualmente en:

- negocios individuales
- agentes de IA sin cuentas bancarias tradicionales
- plataformas de creadores
- plataformas de servicios digitales
- negocios lícitos de alto riesgo
- operadores expuestos a declinaciones de tarjetas
- operadores bloqueados por el onboarding de procesadores tradicionales
- marketplaces que necesitan flujos de pago que preserven la privacidad

## Dos opciones de despliegue

**[`/mono`](https://github.com/P2Pagos/mono) — Licencia MIT, self-hostable.**
Orquestador single-user. El punto de partida para operadores individuales, agentes de IA y pequeños negocios. Forkéalo, córrelo, personalízalo.

**`/marketplace` — Closed-source, gestionado.**
Capa marketplace multi-usuario construida sobre `/mono`. Para plataformas que necesitan gestión de usuarios, flujos white-label, planes de membresía, triggers KYC e infraestructura gestionada dedicada.

## Qué resuelve Fiat2Chain

Los procesadores de pago tradicionales suelen fallar antes de que el negocio llegue al cliente.

Los problemas comunes son:

- onboarding rechazado
- países no soportados
- altas tasas de declinación de tarjetas
- falsos positivos
- dependencia del procesador
- exposición a chargebacks
- opciones de liquidación limitadas
- revelación forzada de datos sensibles del merchant
- cuentas bloqueadas o congeladas
- falta de canales de respaldo

Fiat2Chain lo resuelve separando el método de pago del cliente de la liquidación del merchant.

El cliente paga con el método de tarjeta, local, marketplace o fiat disponible. El merchant, creador o destinatario final liquida en Bitcoin o stablecoins a través de un flujo controlado, documentado y consciente del canal.

## Soporte gestionado

Fiat2Chain es un servicio gestionado.

Apoyamos al cliente final durante la ejecución del pago y al merchant o marketplace en todo el proceso técnico, operativo y de documentación.

El soporte puede incluir:

- guía de pago al cliente
- onboarding del merchant
- diseño del flujo de onboarding del creador
- configuración de wallet
- configuración de BTCPay Server
- configuración de instancia marketplace
- configuración de planes de membresía
- configuración del flujo de liquidación
- coordinación de canales locales
- seguimiento del estado del pago
- documentación de transacciones
- soporte de origen de fondos cuando sea necesario
- resolución de problemas operativos
- soporte de compliance con servicios intermediarios que forman parte del canal

## Enfoque Mono2Multi

Fiat2Chain sigue el principio Mono2Multi.

Un flujo de pago en producción no debe depender de un solo procesador, cuenta, país, método de pago o canal de liquidación.

Cuando el pago de un cliente falla por un falso positivo, tarjeta bloqueada, país no soportado, regla del procesador, limitación local o desajuste de verificación, el negocio debe tener otra ruta lista.

El canal utilizable y el camino de liquidación importan más que la ideología.

## Privacidad por arquitectura

Fiat2Chain está diseñado para reducir la exposición innecesaria de datos personales o empresariales sensibles.

En flujos de marketplace, el comprador no debería necesitar acceso a la identidad real del creador. El creador no debería necesitar acceso a datos innecesarios del comprador. La plataforma no debería convertirse en el intermediario financiero salvo que tenga una razón legal y operativa clara para hacerlo.

El objetivo es minimización de datos, liquidación más segura y separación más limpia entre plataforma, cliente y creador.

Esto es especialmente importante para marketplaces donde las fallas de privacidad pueden crear riesgos reales de seguridad personal.

## Implementación

Fiat2Chain puede implementarse como:

- flujo de pago gestionado
- checkout alojado
- integración API
- módulo de pago marketplace
- flujo de liquidación self-custodial
- configuración basada en BTCPay Server
- flujo de pago white-label
- instancia marketplace dedicada con planes de membresía

## Referencia de infraestructura

Referencia técnica de canales soportados, wallets de liquidación, módulos de servicio, modos de custodia y arquitectura:

[→ Referencia de infraestructura Fiat2Chain](/servicios/fiat-2-chain/infrastructure)
