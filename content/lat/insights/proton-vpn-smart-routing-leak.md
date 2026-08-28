---
date: "2025-05-15"
title: "Proton2Miami"
subtitle: "Cuando el Smart Routing del VPN compromete la seguridad de ubicación para usuarios de Bitcoin y Stablecoins"
description: "Tanto el equipo de seguridad como el de soporte de Proton conocen este fallo en el servicio que promueven como Smart Routing, que afecta a regiones enteras como América Latina."
tags:
  - seguridad proton vpn
  - smart routing
  - geolocalización vpn
  - cloudflare
  - pagos bitcoin y stablecoins
  - infraestructura de pagos
  - detección de ip
  - PE'AHA
---

*Tanto el equipo de seguridad como el de soporte de Proton conocen este problema. Smart Routing enruta el tráfico latinoamericano y de otras regiones a través de servidores en EE.UU. (Miami) o Reino Unido (Londres), lo que hace que Cloudflare y las bases de datos de IP detecten el país del servidor físico — no el país seleccionado en el VPN. Esto bloquea el acceso a plataformas de bitcoin, stablecoins y pagos que restringen el tráfico de EE.UU.; socava los controles de ubicación de creadores en plataformas con privacidad sensible; y crea ambigüedad de cumplimiento para empresas y equipos remotos. Incluye un desglose completo por país y población de 23 ubicaciones afectadas, ~6,7 millones de usuarios de Proton impactados, nuestra respuesta de despliegue de VPN propio, y recomendaciones para proveedores de VPN, plataformas de contenido y arquitectos de infraestructura de pagos.*

Referencias: [Issue en GitHub](https://github.com/ProtonVPN/proton-vpn-gtk-app/issues/164) · [Documentación Proton Smart Routing](https://protonvpn.com/support/how-smart-routing-works) · [Módulo /ip de PE'AHA](https://github.com/paga-peaha-ai/orchestrator/tree/main/services/ip)

## Evidencia en vídeo

Probado servidor por servidor usando el propio `ip.me` de Proton, la GUI de Proton VPN para Linux, y un worker de Cloudflare que devuelve `CF-IPCountry` directamente. La carpeta privada contiene pruebas adicionales suficientes para que "Smart Routing" sea un nombre de marca muy generoso.

<iframe width="100%" style="aspect-ratio:16/9;display:block;" src="https://www.youtube.com/embed/oTLF6sNIcSg?enablejsapi=1" title="Prueba de IP con Proton VPN Smart Routing" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

<a href="https://youtu.be/oTLF6sNIcSg" target="_blank" rel="noopener" data-umami-event="proton2miami-youtube-direct">Enlace directo →</a>

## El problema central

Smart Routing sirve ubicaciones LATAM a través de servidores en EE.UU.; `CF-IPCountry` detecta la ubicación física — no el país seleccionado en el VPN — bloqueando a usuarios en plataformas de bitcoin, stablecoins y pagos que restringen el tráfico de EE.UU. Confirmado en múltiples cuentas de Proton, dos organizaciones, trabajo diario y servicios con control de acceso de Cloudflare.

Cinco modos concretos de fallo:
- La UI del VPN muestra un país LATAM; Cloudflare detecta Miami
- Plataformas de bitcoin/stablecoins bloquean usuarios de EE.UU. → usuario LATAM seleccionado bloqueado
- Imposible incluir en lista blanca IPs estables — las IPs de Smart Routing son compartidas y mal etiquetadas
- El equipo remoto necesita jurisdicción predecible; Smart Routing la hace ambigua
- La UI no indica si un servidor es físico o enrutado por Smart Routing

## Países afectados — Smart Routing puro

| País del VPN       | Servidor físico        | Población |
|--------------------|------------------------|-----------|
| Costa Rica         | EE.UU. — Miami         | 5,17 M    |
| Cuba               | EE.UU. — Miami         | 10,89 M   |
| República Dominicana | EE.UU. — Miami       | 11,61 M   |
| Ecuador            | EE.UU. — Miami         | 18,44 M   |
| El Salvador        | EE.UU. — Miami         | 6,39 M    |
| Guatemala          | EE.UU. — Miami         | 18,97 M   |
| Haití              | EE.UU. — Miami         | 12,04 M   |
| Honduras           | EE.UU. — Miami         | 11,18 M   |
| Jamaica            | EE.UU. — Miami         | 2,83 M    |
| Libia              | Reino Unido — Londres  | 7,54 M    |
| Liechtenstein      | Francia — París        | 40 K      |
| Nicaragua          | EE.UU. — Miami         | 7,10 M    |
| Panamá             | EE.UU. — Los Ángeles   | 4,63 M    |
| Paraguay           | EE.UU. — Miami         | 7,10 M    |
| Uruguay            | EE.UU. — Miami         | 3,38 M    |
| Venezuela          | EE.UU. — Miami         | 28,63 M   |

## Ubicaciones mixtas (físico + Smart Routing, ambiguo operativamente)

La UI no distingue qué tipo de servidor se asigna; tratar como no confiable para uso de cumplimiento.

| País del VPN | Servidor físico       | Población |
|-------------|----------------------|-----------|
| Argentina   | EE.UU. — Miami       | 46,00 M   |
| Bolivia     | EE.UU. — Miami       | 12,75 M   |
| Brasil      | EE.UU. — Miami       | 213,56 M  |
| Chile       | EE.UU. — Miami       | 19,95 M   |
| Colombia    | EE.UU. — Los Ángeles | 53,94 M   |
| México      | EE.UU. — Miami       | 133,00 M  |
| Perú        | EE.UU. — Miami       | 34,92 M   |

**Total afectado ≈ 670 millones de personas.** Proton reporta ~100 millones de usuarios en todo el mundo; con ~1% de adopción regional, **~6,7 millones de usuarios de Proton** están potencialmente impactados.

## Por qué los sitios de bitcoin y stablecoins son especialmente afectados

Los sitios de bitcoin y stablecoins usan Cloudflare muy por encima del promedio global del 22,4% — objetivos habituales de DDoS, abuso de bots, phishing, filtros de cumplimiento y controles de acceso por jurisdicción. `CF-IPCountry` controla el acceso; Smart Routing activa la detección de EE.UU., bloqueando a usuarios en plataformas que restringen el servicio a visitantes de ese país.

## Plataformas con privacidad sensible y control de ubicación para creadores

Las plataformas que restringen contenido por país — crítico cuando la ubicación del creador tiene implicaciones directas de seguridad — se ven afectadas por Smart Routing desde ambos lados: espectadores en países bloqueados evaden restricciones apareciendo como usuarios de EE.UU., mientras que creadores en servidores Smart Routing de LATAM son silenciosamente identificados como residentes en EE.UU.

La señal de IP única es insuficiente; cruzar `CF-IPCountry` con la IP declarada del VPN — una discrepancia debería elevar el umbral de confianza, no reducirlo. El [módulo `/ip` de PE'AHA](https://github.com/paga-peaha-ai/orchestrator/tree/main/services/ip) devuelve ambas señales de serie.

## Impacto en negocios y seguridad

El usuario selecciona VPN LATAM → el sitio detecta tráfico de EE.UU. → la plataforma bloquea → el usuario ve un producto roto, no la causa raíz de Smart Routing. Coste de soporte, ingresos perdidos y suposiciones erróneas de elegibilidad — especialmente dañino para bitcoin, stablecoins, pagos P2P y liquidación transfronteriza.

Smart Routing puede ser seguro en el túnel, pero vender Paraguay o Ecuador como ubicación efectiva cuando la latencia y las bases de datos de IP muestran Miami es una contradicción práctica — y la razón por la que Proton nos perdió como potenciales clientes de IP dedicada de pago.

## Nuestra solución: dos despliegues de VPN controlados

**Paraguay (Caaguazú)** — VPS para acceso diario del equipo (~10 meses/año en sitio); IPs estables de PY para dashboards, herramientas de administración, sitios de bitcoin/stablecoins y servicios con control de Cloudflare.

**Canadá** — Bare-metal en infraestructura propia de la empresa; acceso corporativo, gestión de servidores, IPs en lista blanca, y flujos de pago/banca; separado de la navegación del equipo.

## Cómo usamos la detección de IP en la práctica

En [PE'AHA Orchestrator](https://github.com/paga-peaha-ai/orchestrator) y [PE'AHA Cloud](https://github.com/paga-peaha-ai/cloud), el módulo `/ip` cumple un único propósito: determinar la primera moneda fiat y los métodos de pago mostrados en el checkout. Tanto el país detectado por Cloudflare (`CF-IPCountry`) como el país declarado por el VPN se exponen, permitiendo al usuario elegir basándose en cualquiera de los dos — respetando cómo el visitante quiere aparecer. Nada más.

## Lecciones y recomendaciones

**Proveedores de VPN** deben declarar por servidor: físico vs. Smart Routing, ubicación física real, probabilidad de discrepancia con Cloudflare/bases de datos de IP, idoneidad para cumplimiento, y si un producto de IP dedicada evita la ambigüedad.

**Sitios de bitcoin, stablecoins y pagos** no deberían bloquear solo por país de IP — los falsos positivos afectan a usuarios de VPN, Tor, móvil y equipos remotos. Estrategia por capas: país IP → detectar incertidumbre → confirmación explícita para acciones sensibles → controles de cumplimiento solo en la capa de acción regulada.

**Arquitectos de infraestructura de pagos**: la geolocalización por IP no es una fuente de verdad. Detección mínima, incertidumbre explícita, privacidad por defecto, gateways de negocio estables, confirmación del usuario cuando sea necesario, sin seguimiento innecesario.
