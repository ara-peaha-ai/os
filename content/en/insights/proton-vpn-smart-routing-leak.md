---
date: "2025-05-15"
title: "When VPN Smart Routing Breaks Location Security for Bitcoin and Stablecoins Users"
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

## When VPN Smart Routing Breaks Location Security for Bitcoin and Stablecoins Users

### *Both Proton's security and support departments are aware of this issue.*

*Proton VPN's Smart Routing routes Latin American and other regional traffic through US servers (Miami) or UK servers (London), causing Cloudflare and IP databases to detect the connection as the physical server country — not the VPN-selected one. This breaks access for bitcoin, stablecoins, and payment platforms that restrict US traffic; undermines creator location controls on privacy-sensitive platforms; and creates compliance ambiguity for businesses and remote teams. This insight covers a full country-by-population breakdown across 23 affected locations, a scale estimate of ~6.7 million impacted Proton users, our own VPN deployment response, and recommendations for VPN providers, content platforms, and payment infrastructure architects.*

References: [GitHub issue](https://github.com/ProtonVPN/proton-vpn-gtk-app/issues/164) · [Proton Smart Routing docs](https://protonvpn.com/support/how-smart-routing-works) · [P2Pagos /ip module](https://github.com/P2Pagos/mono/tree/main/services/ip)

## Video Evidence

Tested server by server using Proton's own `ip.me`, the Proton VPN Linux GUI, and a Cloudflare-deployed worker returning `CF-IPCountry` directly. The private folder contains additional tests of Proton's handling sufficient to make "Smart Routing" a very generous brand name.

<iframe width="560" height="315" src="https://www.youtube.com/embed/oTLF6sNIcSg" title="Proton VPN Smart Routing IP Test" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

https://youtu.be/oTLF6sNIcSg?si=__h-0liBgtkoWcxg

## Core Problem

Proton VPN Smart Routing serves LATAM locations through US servers. `CF-IPCountry` and IP databases detect the physical server location — not the VPN-selected country. For bitcoin, stablecoins, and payment platforms restricting US traffic, the user gets blocked despite selecting a non-US VPN location. The issue affected personal daily work, company operations, multiple Proton accounts, two organizations, bitcoin/stablecoins websites, and Cloudflare-gated services.

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

W3Techs estimates Cloudflare at 22.4% of all websites globally, but bitcoin and stablecoins websites use it far above average — they are common targets for DDoS, bot abuse, phishing, scraping, compliance filtering, and jurisdiction-based access controls. Cloudflare's `CF-IPCountry` header is widely used to gate access; Smart Routing triggers US detection, which triggers blocks on platforms restricted from serving US visitors.

## Privacy-Sensitive Platforms and Creator Location Control

Some platforms let users restrict who can access their content by country — a feature used in professional services where geographic privacy has direct safety implications for the content creator. Smart Routing compounds the risk from both directions: a viewer in a restricted country may appear as a US visitor and bypass the block, while a creator connecting through a LATAM Smart Routing server may be misidentified as US-based, silently breaking their own location protections.

For platforms where location-based access control has real safety stakes, a single IP signal is not sufficient. The reliable approach is to cross-reference two independent origins: the infrastructure-detected country (e.g., Cloudflare `CF-IPCountry`) and the VPN server's declared or resolved IP. A mismatch between the two should raise — not lower — the confidence threshold before granting access.

The [P2Pagos `/ip` module](https://github.com/P2Pagos/mono/tree/main/services/ip) supports this dual-origin identification — returning both the physical server IP and the infrastructure-detected country — so platforms can implement a two-signal check without building custom detection logic.

## Business and Security Impact

User selects LATAM VPN location → site detects US-based traffic → platform blocks access → user sees only a broken product, not the Smart Routing root cause. This creates support cost, lost revenue, and false assumptions about eligibility — especially damaging for Bitcoin, stablecoins, P2P payments, and cross-border settlement companies.

Smart Routing may be secure at the tunnel level. But selling Paraguay, Uruguay, Ecuador, Costa Rica, or Venezuela as the effective location when latency and IP databases indicate Miami is a practical contradiction for compliance-sensitive work. This is also why Proton lost us as a potential customer for its paid dedicated IP service: if Smart Routing cannot deliver reliable country detection in daily operations, the premium IP upsell cannot be justified.

## Our Solution: Two Controlled VPN Deployments

**Paraguay (Caaguazú)** — VPS for team daily access (team present ~10 months/year); provides stable PY IPs for operational dashboards, admin tools, bitcoin/stablecoins sites, Cloudflare-gated services, and elimination of false blocks from Smart Routing mislabeling.

**Canada** — Bare-metal server on company infrastructure; for international company access, infrastructure administration, server management, whitelisted IP access, payment and banking-related flows; separates company infrastructure from team browsing.

Two clear controlled access points. Predictable IPs, predictable jurisdictions, no Smart Routing ambiguity.

## Why Payment Infrastructure Needs Its Own IP Detection Layer

IP location is a weak signal: databases disagree, VPNs and Tor obscure routing, Cloudflare may detect one country while another provider reports another, mobile networks route unexpectedly. The [P2Pagos `/ip` module](https://github.com/P2Pagos/mono/tree/main/services/ip) is designed around privacy-first minimal detection:

- Detect country and probable currency only when needed; prefer `CF-IPCountry`, fall back to IPinfo-style databases
- Avoid fingerprinting; respect Tor and VPN users; keep detection separate from identity verification
- Never treat IP location as a perfect compliance signal

A privacy-oriented system should not punish VPN or Tor users by default — legitimate reasons include personal safety, censorship avoidance, business travel, remote work, unstable local networks, targeted-attack protection, and home IP exposure avoidance. The correct approach is confidence classification, not blind blocking:

- High-confidence detection → preselect currency/local rail
- Low-confidence → show neutral options
- VPN/Tor detected → reduce assumptions
- Sensitive action → explicit user confirmation
- Compliance-heavy flow → verification only at the regulated-action step

## Lessons and Recommendations

**VPN providers** must disclose per server: physical vs. Smart Routed, actual physical location, likelihood of Cloudflare/IP-database country mismatch, compliance suitability, and whether a dedicated IP product avoids the ambiguity. Without this transparency no informed operational decision is possible.

**Bitcoin, stablecoins, and payment websites** should not block on IP country alone — false positives hit legitimate users behind VPNs, Tor, mobile carriers, and remote teams. Layered model: IP country as first signal → detect uncertainty → explicit user confirmation for sensitive actions → compliance checks only at the regulated-action layer, not at browse-time.

**Payment infrastructure architects**: IP geolocation is not a source of truth. The right architecture is minimal detection, explicit uncertainty, privacy by default, stable business gateways where needed, user confirmation when required, no unnecessary tracking, no false precision — the only realistic approach for users who live and work across borders.
