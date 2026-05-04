<script setup>
const colorMode = useColorMode()
const nodeBg = computed(() => colorMode.value === 'dark' ? '#0c1a2e' : '#f1f5f9')
const { locale } = useI18n()
const devLabel = computed(() => ({
  en: 'Graphic under development',
  es: 'Gráfico en desarrollo',
  pt: 'Gráfico em desenvolvimento'
}[locale.value] ?? 'Graphic under development'))
</script>

<template>
  <div class="sa-container">
  <svg viewBox="0 0 800 320" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto select-none" aria-hidden="true">
    <defs>
      <filter id="sa-glow" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="2.8" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>

      <!-- PIX inline symbol (fill black → node color to work in dark mode) -->
      <symbol id="sym-pix" viewBox="0 0 16 16">
        <path d="M11.917 11.71a2.046 2.046 0 0 1-1.454-.602l-2.1-2.1a.4.4 0 0 0-.551 0l-2.108 2.108a2.044 2.044 0 0 1-1.454.602h-.414l2.66 2.66c.83.83 2.177.83 3.007 0l2.667-2.668h-.253zM4.25 4.282c.55 0 1.066.214 1.454.602l2.108 2.108a.39.39 0 0 0 .552 0l2.1-2.1a2.044 2.044 0 0 1 1.453-.602h.253L9.503 1.623a2.127 2.127 0 0 0-3.007 0l-2.66 2.66h.414z" fill="#3D5A8A" />
        <path d="m14.377 6.496-1.612-1.612a.307.307 0 0 1-.114.023h-.733c-.379 0-.75.154-1.017.422l-2.1 2.1a1.005 1.005 0 0 1-1.425 0L5.268 5.32a1.448 1.448 0 0 0-1.018-.422h-.9a.306.306 0 0 1-.109-.021L1.623 6.496c-.83.83-.83 2.177 0 3.008l1.618 1.618a.305.305 0 0 1 .108-.022h.901c.38 0 .75-.153 1.018-.421L7.375 8.57a1.034 1.034 0 0 1 1.426 0l2.1 2.1c.267.268.638.421 1.017.421h.733c.04 0 .079.01.114.024l1.612-1.612c.83-.83.83-2.178 0-3.008z" fill="#3D5A8A" />
      </symbol>

      <!-- clip circles for image-based logos -->
      <clipPath id="cp-venmo">   <circle cx="185" cy="105" r="22" /></clipPath>
      <clipPath id="cp-pix">     <circle cx="315" cy="188" r="22" /></clipPath>
      <clipPath id="cp-sberbank"><circle cx="478" cy="58"  r="22" /></clipPath>
      <clipPath id="cp-mpesa">   <circle cx="490" cy="162" r="22" /></clipPath>
      <clipPath id="cp-btc">     <circle cx="685" cy="90"  r="22" /></clipPath>
      <clipPath id="cp-usdt">    <circle cx="685" cy="162" r="22" /></clipPath>

      <!-- payment → crypto -->
      <path id="sa-lr1" d="M 185,105 C 435,48  565,55  685,90"  />
      <path id="sa-lr2" d="M 315,188 C 490,248 598,248 685,235" />
      <path id="sa-lr3" d="M 478,58  C 560,38  635,55  685,90"  />
      <path id="sa-lr4" d="M 490,162 C 565,148 635,152 685,162" />
      <path id="sa-lr5" d="M 185,105 C 440,82  572,122 685,162" />

      <!-- crypto → payment -->
      <path id="sa-rl1" d="M 685,90  C 565,55  435,48  185,105" />
      <path id="sa-rl2" d="M 685,162 C 572,205 432,210 315,188" />
      <path id="sa-rl3" d="M 685,235 C 620,210 555,188 490,162" />
    </defs>

    <!-- world map background -->
    <g fill="none" stroke="#64748b" stroke-width="0.7" opacity="0.07">
      <path d="M 50,30 L 215,15 L 275,52 L 262,80 L 220,112 L 200,130 L 155,118 L 130,88 L 110,62 Z" />
      <path d="M 298,18 L 360,13 L 370,33 L 345,52 L 308,55 L 295,42 Z" />
      <path d="M 228,138 L 268,133 L 322,168 L 312,200 L 275,218 L 248,255 L 228,205 L 218,158 Z" />
      <path d="M 375,95 L 390,75 L 408,70 L 450,68 L 463,32 L 455,50 L 447,90 L 425,100 L 375,95 Z" />
      <path d="M 370,98 L 425,98 L 512,138 L 478,220 L 440,222 L 400,190 L 368,155 L 358,130 Z" />
      <path d="M 458,90 L 472,104 L 552,115 L 582,150 L 632,155 L 712,95 L 700,80 L 635,27 L 480,58 Z" />
      <path d="M 658,178 L 720,175 L 735,215 L 720,230 L 660,220 L 650,195 Z" />
    </g>

    <!-- subtle route strokes -->
    <g fill="none" stroke-width="0.8" opacity="0.08">
      <path d="M 185,105 C 435,48  565,55  685,90"  stroke="#3396cd" />
      <path d="M 315,188 C 490,248 598,248 685,235" stroke="#3D5A8A" />
      <path d="M 478,58  C 560,38  635,55  685,90"  stroke="#26A17B" />
      <path d="M 490,162 C 565,148 635,152 685,162" stroke="#26A17B" />
      <path d="M 185,105 C 440,82  572,122 685,162" stroke="#3396cd" />
      <path d="M 685,90  C 565,55  435,48  185,105" stroke="#F7931A" />
      <path d="M 685,162 C 572,205 432,210 315,188" stroke="#26A17B" />
      <path d="M 685,235 C 620,210 555,188 490,162" stroke="#2775CA" />
    </g>

    <!-- Venmo — USA -->
    <circle cx="185" cy="105" r="24" :fill="nodeBg" stroke="#3396cd" stroke-width="1.5" />
    <image href="/venmo.svg" x="161" y="81" width="48" height="48" clip-path="url(#cp-venmo)" />
    <text x="185" y="142" text-anchor="middle" font-size="8" font-family="monospace" fill="#3396cd" opacity="0.6">Venmo</text>

    <!-- PIX — Brazil -->
    <circle cx="315" cy="188" r="24" :fill="nodeBg" stroke="#3D5A8A" stroke-width="1.5" />
    <use href="#sym-pix" x="293" y="166" width="44" height="44" clip-path="url(#cp-pix)" />
    <text x="315" y="225" text-anchor="middle" font-size="8" font-family="monospace" fill="#3D5A8A" opacity="0.6">PIX</text>

    <!-- Sberbank — Russia -->
    <circle cx="478" cy="58" r="24" :fill="nodeBg" stroke="#26A17B" stroke-width="1.5" />
    <image href="/sberbank.svg" x="454" y="34" width="48" height="48" clip-path="url(#cp-sberbank)" />
    <text x="478" y="95" text-anchor="middle" font-size="8" font-family="monospace" fill="#26A17B" opacity="0.6">Sberbank</text>

    <!-- M-Pesa — Kenya -->
    <circle cx="490" cy="162" r="24" :fill="nodeBg" stroke="#aed580" stroke-width="1.5" />
    <image href="/mpesa.svg" x="466" y="138" width="48" height="48" clip-path="url(#cp-mpesa)" />
    <text x="490" y="199" text-anchor="middle" font-size="8" font-family="monospace" fill="#aed580" opacity="0.6">M-Pesa</text>

    <!-- BTC -->
    <circle cx="685" cy="90"  r="24" :fill="nodeBg" stroke="#F7931A" stroke-width="1.5" />
    <image href="/bitcoin.svg" x="661" y="66" width="48" height="48" clip-path="url(#cp-btc)" />
    <text x="685" y="127" text-anchor="middle" font-size="8" font-family="monospace" fill="#F7931A" opacity="0.55">Bitcoin</text>

    <!-- USDT -->
    <circle cx="685" cy="162" r="24" :fill="nodeBg" stroke="#26A17B" stroke-width="1.5" />
    <image href="/usdt.svg" x="663" y="140" width="44" height="44" clip-path="url(#cp-usdt)" />
    <text x="685" y="199" text-anchor="middle" font-size="8" font-family="monospace" fill="#26A17B" opacity="0.55">Tether</text>

    <!-- USDC -->
    <circle cx="685" cy="235" r="24" :fill="nodeBg" stroke="#2775CA" stroke-width="1.5" />
    <text x="685" y="233" text-anchor="middle" font-size="10" font-family="monospace" font-weight="700" fill="#2775CA">USDC</text>
    <text x="685" y="245" text-anchor="middle" font-size="7"  font-family="monospace" fill="#2775CA" opacity="0.65">Polygon</text>
    <text x="685" y="272" text-anchor="middle" font-size="8" font-family="monospace" fill="#2775CA" opacity="0.55">USD Coin</text>

    <!-- animated particles -->
    <g class="sa-particles">
      <circle r="4"   fill="#3396cd" filter="url(#sa-glow)" opacity="0.9">
        <animateMotion dur="4s"   repeatCount="indefinite" begin="0s">  <mpath href="#sa-lr1" /></animateMotion>
      </circle>
      <circle r="3"   fill="#3396cd" filter="url(#sa-glow)" opacity="0.65">
        <animateMotion dur="4s"   repeatCount="indefinite" begin="1.4s"><mpath href="#sa-lr1" /></animateMotion>
      </circle>
      <circle r="2.5" fill="#3396cd" opacity="0.45">
        <animateMotion dur="4s"   repeatCount="indefinite" begin="2.8s"><mpath href="#sa-lr1" /></animateMotion>
      </circle>
      <circle r="3.5" fill="#3D5A8A" filter="url(#sa-glow)" opacity="0.85">
        <animateMotion dur="4.6s" repeatCount="indefinite" begin="1.2s"><mpath href="#sa-lr2" /></animateMotion>
      </circle>
      <circle r="2.5" fill="#3D5A8A" opacity="0.5">
        <animateMotion dur="4.6s" repeatCount="indefinite" begin="3.4s"><mpath href="#sa-lr2" /></animateMotion>
      </circle>
      <circle r="3.5" fill="#26A17B" filter="url(#sa-glow)" opacity="0.8">
        <animateMotion dur="3.4s" repeatCount="indefinite" begin="0.6s"><mpath href="#sa-lr3" /></animateMotion>
      </circle>
      <circle r="2.5" fill="#26A17B" opacity="0.5">
        <animateMotion dur="3.4s" repeatCount="indefinite" begin="2.0s"><mpath href="#sa-lr3" /></animateMotion>
      </circle>
      <circle r="3"   fill="#aed580" filter="url(#sa-glow)" opacity="0.8">
        <animateMotion dur="2.8s" repeatCount="indefinite" begin="0.9s"><mpath href="#sa-lr4" /></animateMotion>
      </circle>
      <circle r="2.5" fill="#3396cd" opacity="0.55">
        <animateMotion dur="4.2s" repeatCount="indefinite" begin="0.4s"><mpath href="#sa-lr5" /></animateMotion>
      </circle>
      <circle r="4"   fill="#F7931A" filter="url(#sa-glow)" opacity="0.9">
        <animateMotion dur="4.1s" repeatCount="indefinite" begin="2.1s"><mpath href="#sa-rl1" /></animateMotion>
      </circle>
      <circle r="2.8" fill="#F7931A" opacity="0.6">
        <animateMotion dur="4.1s" repeatCount="indefinite" begin="0.4s"><mpath href="#sa-rl1" /></animateMotion>
      </circle>
      <circle r="3.5" fill="#26A17B" filter="url(#sa-glow)" opacity="0.75">
        <animateMotion dur="3.9s" repeatCount="indefinite" begin="1.6s"><mpath href="#sa-rl2" /></animateMotion>
      </circle>
      <circle r="3"   fill="#2775CA" filter="url(#sa-glow)" opacity="0.65">
        <animateMotion dur="3.8s" repeatCount="indefinite" begin="2.7s"><mpath href="#sa-rl3" /></animateMotion>
      </circle>
    </g>

    <!-- static fallback (prefers-reduced-motion) -->
    <g class="sa-static">
      <circle cx="435" cy="72"  r="3" fill="#3396cd" opacity="0.5" />
      <circle cx="550" cy="108" r="3" fill="#26A17B" opacity="0.5" />
      <circle cx="500" cy="212" r="3" fill="#3D5A8A" opacity="0.5" />
    </g>
  </svg>
  <div class="sa-dev-overlay">{{ devLabel }}</div>
  </div>
</template>

<style scoped>
@media (prefers-reduced-motion: reduce) {
  .sa-particles { display: none; }
  .sa-static    { display: block; }
}
.sa-static { display: none; }

.sa-container {
  position: relative;
}

.sa-dev-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-style: italic;
  color: rgba(100, 116, 139, 0.85);
  pointer-events: none;
  z-index: 10;
}
</style>
