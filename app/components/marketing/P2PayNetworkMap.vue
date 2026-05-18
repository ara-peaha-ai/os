<script setup>
import { paymentRails, cryptoDestinations } from '~/data/paymentRails.js'
const { locale } = useI18n()
const devLabel = computed(() => ({
  en: 'Graphic under development',
  es: 'Gráfico en desarrollo',
  pt: 'Gráfico em desenvolvimento'
}[locale.value] ?? 'Graphic under development'))

const mapAsset = '/blank-world-map.svg'
const destX = 36
const destY = 58

const routePaths = {
  venmo:    'M 18 38 C 22 43, 28 50, 36 58',
  pix:      'M 31 66 C 32 63, 34 60, 36 58',
  mpesa:    'M 52 67 C 48 66, 42 63, 36 58',
  imps:     'M 66 51 C 57 52, 46 55, 36 58',
  sberbank: 'M 61 31 C 55 39, 47 49, 36 58'
}

const routeDurations = {
  venmo: 5.2,
  pix: 3.5,
  mpesa: 5.8,
  imps: 4.9,
  sberbank: 6.2
}

const allDots = paymentRails.flatMap((rail) => {
  const baseDur = routeDurations[rail.id]
  const count = 5
  return Array.from({ length: count }, (_, i) => {
    const dur = baseDur + i * 0.35
    const begin = (i * baseDur) / count
    const opacity = 0.65 + (i % 2) * 0.28
    return {
      id: `${rail.id}-dot-${i}`,
      railId: rail.id,
      dur: `${dur.toFixed(2)}s`,
      begin: `${begin.toFixed(2)}s`,
      r: 0.52 + (i % 3) * 0.13,
      fill: i % 3 === 2 ? '#fde68a' : '#f59e0b',
      opacityValues: `0;${opacity};${opacity};0`
    }
  })
})

const networkNodes = [
  { cx: 25, cy: 45 }, { cx: 40, cy: 35 }, { cx: 45, cy: 52 },
  { cx: 33, cy: 50 }, { cx: 50, cy: 44 }, { cx: 28, cy: 55 },
  { cx: 42, cy: 48 }, { cx: 38, cy: 42 }, { cx: 55, cy: 40 },
  { cx: 48, cy: 62 }, { cx: 22, cy: 52 }, { cx: 35, cy: 63 },
  { cx: 30, cy: 42 }, { cx: 43, cy: 56 }
]

const networkLines = [
  [25, 45, 33, 50], [33, 50, 40, 35], [40, 35, 50, 44],
  [45, 52, 42, 48], [42, 48, 38, 42], [28, 55, 35, 63],
  [35, 63, 36, 58], [22, 52, 28, 55], [43, 56, 45, 52],
  [30, 42, 38, 42], [48, 62, 43, 56]
]
</script>

<template>
  <div class="map-wrapper">
    <svg
      class="svg-overlay"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <filter id="p2p-dot-glow" x="-80%" y="-80%" width="260%" height="260%" color-interpolation-filters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.55" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="p2p-node-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="p2p-latam-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.3" />
          <stop offset="55%" stop-color="#f59e0b" stop-opacity="0.1" />
          <stop offset="100%" stop-color="#f59e0b" stop-opacity="0" />
        </radialGradient>
        <path id="p2p-path-venmo" d="M 18 38 C 22 43, 28 50, 36 58" fill="none" stroke="none" />
        <path id="p2p-path-pix" d="M 31 66 C 32 63, 34 60, 36 58" fill="none" stroke="none" />
        <path id="p2p-path-mpesa" d="M 52 67 C 48 66, 42 63, 36 58" fill="none" stroke="none" />
        <path id="p2p-path-imps" d="M 66 51 C 57 52, 46 55, 36 58" fill="none" stroke="none" />
        <path id="p2p-path-sberbank" d="M 61 31 C 55 39, 47 49, 36 58" fill="none" stroke="none" />
      </defs>

      <ellipse :cx="destX" :cy="destY" rx="9" ry="7" fill="url(#p2p-latam-glow)" />

      <g class="network-lines">
        <line
          v-for="(seg, i) in networkLines"
          :key="`nl-${i}`"
          :x1="seg[0]" :y1="seg[1]"
          :x2="seg[2]" :y2="seg[3]"
          stroke="#f59e0b"
          stroke-width="0.2"
        />
      </g>

      <g class="network-nodes" filter="url(#p2p-node-glow)">
        <circle
          v-for="(node, i) in networkNodes"
          :key="`nn-${i}`"
          :cx="node.cx"
          :cy="node.cy"
          r="0.45"
          fill="#f59e0b"
          :opacity="0.18 + (i % 3) * 0.07"
        />
      </g>

      <g class="route-hints">
        <path
          v-for="rail in paymentRails"
          :key="`rh-${rail.id}`"
          :d="routePaths[rail.id]"
          fill="none"
          stroke="#f59e0b"
          stroke-width="0.3"
        />
      </g>

      <g class="animated-dots-group">
        <circle
          v-for="dot in allDots"
          :key="dot.id"
          cx="0"
          cy="0"
          :r="dot.r"
          :fill="dot.fill"
          fill-opacity="0"
          filter="url(#p2p-dot-glow)"
        >
          <animate
            attributeName="fill-opacity"
            :values="dot.opacityValues"
            keyTimes="0;0.06;0.92;1"
            :dur="dot.dur"
            :begin="dot.begin"
            repeatCount="indefinite"
          />
          <animateMotion
            :dur="dot.dur"
            :begin="dot.begin"
            repeatCount="indefinite"
            calcMode="linear"
          >
            <mpath :href="`#p2p-path-${dot.railId}`" />
          </animateMotion>
        </circle>
      </g>

      <g class="static-dots-fallback">
        <circle
          v-for="rail in paymentRails"
          :key="`sf-${rail.id}`"
          :cx="rail.x"
          :cy="rail.y"
          r="1.1"
          fill="#f59e0b"
          opacity="0.6"
          filter="url(#p2p-dot-glow)"
        />
        <circle :cx="destX" :cy="destY" r="1.4" fill="#fde68a" opacity="0.75" filter="url(#p2p-dot-glow)" />
      </g>
    </svg>

    <div
      v-for="rail in paymentRails"
      :key="rail.id"
      class="rail-card"
      :style="{ left: `${rail.x}%`, top: `${rail.y}%` }"
      :aria-label="`${rail.label} — ${rail.country} — ${rail.status}`"
      tabindex="0"
    >
      <img :src="rail.logo" :alt="rail.label" class="rail-logo" />
      <div class="rail-tooltip" role="tooltip">
        <strong>{{ rail.label }}</strong>
        <span>{{ rail.country }}</span>
        <span class="status-badge" :class="`status-${rail.status}`">{{ rail.status }}</span>
      </div>
    </div>

    <div
      class="dest-cluster"
      :style="{ left: `${destX}%`, top: `${destY}%` }"
      aria-label="Latin America — Bitcoin and USDT settlement"
    >
      <div class="dest-ring" />
      <div class="dest-inner">
        <img
          v-for="dest in cryptoDestinations"
          :key="dest.id"
          :src="dest.logo"
          :alt="dest.label"
          class="dest-logo"
        />
      </div>
    </div>

    <p class="dev-caption" aria-live="polite">{{ devLabel }}</p>
  </div>
</template>

<style scoped>
.map-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: oklch(0.208 0.042 265.755);
  border-radius: 0.75rem;
  container-type: inline-size;
}

.map-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
  opacity: 0.16;
  filter: brightness(0.65) saturate(0.15);
  pointer-events: none;
  user-select: none;
}

.svg-overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: visible;
}

.network-lines {
  opacity: 0.1;
}

.route-hints {
  opacity: 0.035;
}

.static-dots-fallback {
  display: none;
}

/* Rail cards */
.rail-card {
  position: absolute;
  transform: translate(-50%, -50%);
  background: rgba(10, 18, 38, 0.75);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 0.5rem;
  padding: 0.4rem;
  backdrop-filter: blur(10px);
  box-shadow:
    0 2px 12px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  cursor: default;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  z-index: 1;
}

.rail-card:hover,
.rail-card:focus-visible {
  border-color: rgba(245, 158, 11, 0.5);
  box-shadow:
    0 2px 18px rgba(245, 158, 11, 0.18),
    0 0 0 1px rgba(245, 158, 11, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
  z-index: 5;
}

.rail-logo {
  display: block;
  width: 2rem;
  height: 2rem;
  object-fit: contain;
}

.rail-tooltip {
  position: absolute;
  bottom: calc(100% + 0.5rem);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(8, 14, 32, 0.97);
  border: 1px solid rgba(245, 158, 11, 0.28);
  border-radius: 0.4rem;
  padding: 0.35rem 0.55rem;
  min-width: 9rem;
  text-align: center;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s;
  white-space: nowrap;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-size: 0.65rem;
  color: #cbd5e1;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.5);
}

.rail-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: rgba(245, 158, 11, 0.28);
}

.rail-card:hover .rail-tooltip,
.rail-card:focus-visible .rail-tooltip {
  opacity: 1;
}

.rail-tooltip strong {
  font-size: 0.72rem;
  color: #fde68a;
  font-weight: 600;
}

.status-badge {
  align-self: center;
  font-size: 0.55rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.1rem 0.35rem;
  border-radius: 0.2rem;
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.22);
}

.status-badge.status-testing {
  background: rgba(34, 197, 94, 0.1);
  color: #4ade80;
  border-color: rgba(34, 197, 94, 0.25);
}

/* Destination cluster */
.dest-cluster {
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 2;
}

.dest-ring {
  position: absolute;
  inset: -8px;
  border-radius: 1rem;
  border: 1px solid rgba(245, 158, 11, 0.22);
  animation: ring-pulse 2.8s ease-in-out infinite;
  pointer-events: none;
}

.dest-inner {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 0.3rem;
  align-items: center;
  background: rgba(10, 18, 38, 0.85);
  border: 1px solid rgba(245, 158, 11, 0.42);
  border-radius: 0.65rem;
  padding: 0.45rem 0.55rem;
  backdrop-filter: blur(12px);
  box-shadow:
    0 0 22px rgba(245, 158, 11, 0.18),
    0 4px 18px rgba(0, 0, 0, 0.55),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.dest-logo {
  width: 1.9rem;
  height: 1.9rem;
  object-fit: contain;
}

@keyframes ring-pulse {
  0%, 100% { opacity: 0.55; transform: scale(1); }
  50% { opacity: 0.15; transform: scale(1.1); }
}

/* Responsive */
@container (max-width: 600px) {
  .rail-logo { width: 1.5rem; height: 1.5rem; }
  .rail-card { padding: 0.28rem; }
  .dest-logo { width: 1.5rem; height: 1.5rem; }
  .dest-inner { padding: 0.32rem 0.4rem; gap: 0.22rem; }
}

@container (max-width: 400px) {
  .rail-logo { width: 1.15rem; height: 1.15rem; }
  .dest-logo { width: 1.15rem; height: 1.15rem; }
}

.dev-caption {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-style: italic;
  color: rgba(255, 255, 255, 0.7);
  pointer-events: none;
  z-index: 10;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .animated-dots-group { display: none; }
  .static-dots-fallback { display: block; }
  .dest-ring { animation: none; }
}
</style>
