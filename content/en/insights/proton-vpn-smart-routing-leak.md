---
date: "2025-05-15"
title: "Proton2Miami"
subtitle: "When VPN Smart Routing Breaks Location Security for Bitcoin and Stablecoins Users"
description: "Both Proton's security and support departments are aware of a leak in the service they promote as Smart Routing Technology, affecting its intended purpose across entire regions such as Latin America."
tags:
  - proton vpn security
  - smart routing
  - vpn geolocation
  - cloudflare
  - bitcoin and stablecoins payments
  - payment infrastructure
  - ip detection
  - p2pagos
---

*Both Proton's security and support departments are aware of this issue. Smart Routing routes Latin American and other regional traffic through US (Miami) or UK (London) servers, causing Cloudflare and IP databases to detect the physical server country — not the VPN-selected one. This breaks access for bitcoin, stablecoins, and payment platforms restricting US traffic; undermines creator location controls on privacy-sensitive platforms; and creates compliance ambiguity for businesses and remote teams. Covers a full country-by-population breakdown across 23 affected locations, ~6.7 million impacted Proton users, our own VPN deployment response, and recommendations for VPN providers, content platforms, and payment architects.*

References: [GitHub issue](https://github.com/ProtonVPN/proton-vpn-gtk-app/issues/164) · [Proton Smart Routing docs](https://protonvpn.com/support/how-smart-routing-works) · [P2Pagos /ip module](https://github.com/P2Pagos/mono/tree/main/services/ip)

## Video Evidence

Tested server by server using Proton's own `ip.me`, the Proton VPN Linux GUI, and a Cloudflare-deployed worker returning `CF-IPCountry` directly. Private folder contains additional tests sufficient to make "Smart Routing" a very generous brand name.

<iframe width="100%" style="aspect-ratio:16/9;display:block;" src="https://www.youtube.com/embed/oTLF6sNIcSg" title="Proton VPN Smart Routing IP Test" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

https://youtu.be/oTLF6sNIcSg

## Core Problem

Smart Routing serves LATAM locations through US servers; `CF-IPCountry` detects the physical location — not the VPN-selected country — blocking users on bitcoin, stablecoins, and payment platforms that restrict US traffic. Confirmed across multiple Proton accounts, two organizations, daily work, and Cloudflare-gated services.

Five concrete failure modes:
- VPN UI shows LATAM country; Cloudflare detects Miami
- Bitcoin/stablecoins platform blocks US users → LATAM-selected user blocked
- Stable IP whitelisting impossible — Smart Routing IPs are shared and mislabeled
- Remote team needs predictable jurisdiction; Smart Routing makes it ambiguous
- UI gives no indication whether a server is physical or Smart Routed

## Affected Countries — Pure Smart Routing

| VPN Country        | Physical Server        | Population |
|--------------------|------------------------|-----------|
| Costa Rica         | US — Miami             | 5.17 M    |
| Cuba               | US — Miami             | 10.89 M   |
| Dominican Republic | US — Miami             | 11.61 M   |
| Ecuador            | US — Miami             | 18.44 M   |
| El Salvador        | US — Miami             | 6.39 M    |
| Guatemala          | US — Miami             | 18.97 M   |
| Haiti              | US — Miami             | 12.04 M   |
| Honduras           | US — Miami             | 11.18 M   |
| Jamaica            | US — Miami             | 2.83 M    |
| Libya              | UK — London            | 7.54 M    |
| Liechtenstein      | France — Paris         | 40 K      |
| Nicaragua          | US — Miami             | 7.10 M    |
| Panama             | US — Los Angeles       | 4.63 M    |
| Paraguay           | US — Miami             | 7.10 M    |
| Uruguay            | US — Miami             | 3.38 M    |
| Venezuela          | US — Miami             | 28.63 M   |

## Mixed Locations (Physical + Smart Routing, Operationally Ambiguous)

UI does not distinguish which server type is assigned; treat as unreliable for compliance use.

| VPN Country | Physical Server    | Population |
|-------------|-------------------|-----------|
| Argentina   | US — Miami        | 46.00 M   |
| Bolivia     | US — Miami        | 12.75 M   |
| Brazil      | US — Miami        | 213.56 M  |
| Chile       | US — Miami        | 19.95 M   |
| Colombia    | US — Los Angeles  | 53.94 M   |
| Mexico      | US — Miami        | 133.00 M  |
| Peru        | US — Miami        | 34.92 M   |

**Total affected ≈ 670 million people.** Proton reports ~100 million users worldwide; at ~1% regional adoption, **~6.7 million Proton users** are potentially impacted.

## Why Bitcoin and Stablecoins Websites Are Especially Affected

Bitcoin and stablecoins websites use Cloudflare far above the global 22.4% average — common targets for DDoS, bot abuse, phishing, compliance filtering, and jurisdiction-based access controls. `CF-IPCountry` gates access; Smart Routing triggers US detection, blocking users on platforms restricted from serving US visitors.

## Privacy-Sensitive Platforms and Creator Location Control

Platforms restricting content by country — critical where creator location has direct safety implications — face Smart Routing from both sides: viewers in blocked countries bypass restrictions appearing as US-based, while creators on LATAM Smart Routing servers are silently misidentified as US.

Single IP signal is insufficient; cross-reference `CF-IPCountry` with the VPN's declared IP — a mismatch should raise the confidence threshold, not lower it. The [P2Pagos `/ip` module](https://github.com/P2Pagos/mono/tree/main/services/ip) returns both signals out of the box.

## Business and Security Impact

User selects LATAM VPN → site detects US traffic → platform blocks → user sees a broken product, not the Smart Routing root cause. Support cost, lost revenue, and false eligibility assumptions — especially damaging for Bitcoin, stablecoins, P2P payments, and cross-border settlement.

Smart Routing may be tunnel-secure, but selling Paraguay or Ecuador as the effective location when latency and IP databases show Miami is a practical contradiction — and why Proton lost us as a potential paid dedicated IP customer.

## Our Solution: Two Controlled VPN Deployments

**Paraguay (Caaguazú)** — VPS for team daily access (~10 months/year on-site); stable PY IPs for dashboards, admin tools, bitcoin/stablecoins sites, and Cloudflare-gated services.

**Canada** — Bare-metal on company infrastructure; company access, server management, whitelisted IPs, and payment/banking flows; separate from team browsing.

## How We Use IP Detection in Practice

In [P2Pagos Mono](https://github.com/P2Pagos/mono) and [P2Pagos Marketplace](https://github.com/P2Pagos/marketplace), the `/ip` module serves one purpose: determining the first fiat currency and payment methods shown at checkout. Both the Cloudflare-detected country (`CF-IPCountry`) and the VPN-declared country are surfaced, letting the user choose based on either — respecting how the visitor wants to appear. Nothing more.

## Lessons and Recommendations

**VPN providers** must disclose per server: physical vs. Smart Routed, actual physical location, Cloudflare/IP-database mismatch likelihood, compliance suitability, and whether a dedicated IP product avoids the ambiguity.

**Bitcoin, stablecoins, and payment websites** should not block on IP country alone — false positives hit VPN, Tor, mobile, and remote users. Layered: IP country → detect uncertainty → explicit confirmation for sensitive actions → compliance checks only at the regulated-action layer.

**Payment infrastructure architects**: IP geolocation is not a source of truth. Minimal detection, explicit uncertainty, privacy by default, stable business gateways, user confirmation when required, no unnecessary tracking.
