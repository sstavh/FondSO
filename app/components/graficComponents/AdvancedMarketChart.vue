<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import type { MarketCompany } from '~/data/marketCompanies'
import { useAdvancedMarketChart } from '~/components/useAdvancedMarketChart'

const props = defineProps<{
  company: MarketCompany
}>()

const currentCompany = computed(() => props.company)

const {
  chartWidth,
  chartHeight,
  paddingLeft,
  paddingRight,
  paddingTop,
  paddingBottom,
  linePath,
  areaPath,
  gridLines,
  timeLabels,
  currentPrice,
  priceChange,
  priceChangePercent,
  ma7Path,
  ma14Path,
  lastPriceY,
  zoom,
  timeframe,
  setTimeframe,
  zoomIn,
  zoomOut,
  zoomAtPoint,
  resetView,
  pan,
  drawMode,
  setDrawMode,
  drawings,
  draftShape,
  startDraw,
  updateDraw,
  finishDraw,
  clearDrawings,
  removeLastDrawing,
  hover,
  hoverPoint,
  setHoverAtX,
  clearHover,
  isLive,
  toggleLive,
} = useAdvancedMarketChart(() => currentCompany.value)

const svgRef = ref<SVGSVGElement | null>(null)
const cardRef = ref<HTMLElement | null>(null)
const isPanning = ref(false)
const lastPanX = ref(0)
const isFullscreen = ref(false)

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value)
}

const getLocalPoint = (event: MouseEvent | WheelEvent) => {
  if (!svgRef.value) return { x: 0, y: 0 }

  const rect = svgRef.value.getBoundingClientRect()
  const scaleX = chartWidth / rect.width
  const scaleY = chartHeight / rect.height

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  }
}

const handleMouseDown = (event: MouseEvent) => {
  const point = getLocalPoint(event)

  if (drawMode.value !== 'none') {
    startDraw(point.x, point.y)
    return
  }

  isPanning.value = true
  lastPanX.value = event.clientX
}

const handleMouseMove = (event: MouseEvent) => {
  const point = getLocalPoint(event)
  setHoverAtX(point.x)

  if (drawMode.value !== 'none') {
    updateDraw(point.x, point.y)
    return
  }

  if (!isPanning.value) return

  const delta = lastPanX.value - event.clientX
  lastPanX.value = event.clientX
  pan(delta * 2)
}

const handleMouseUp = () => {
  if (drawMode.value !== 'none') {
    finishDraw()
  }

  isPanning.value = false
}

const handleMouseLeave = () => {
  if (drawMode.value !== 'none') {
    finishDraw()
  }

  isPanning.value = false
  clearHover()
}

const handleWheel = (event: WheelEvent) => {
  event.preventDefault()
  const point = getLocalPoint(event)
  zoomAtPoint(event.deltaY, point.x)
}

const toggleFullscreen = async () => {
  if (!cardRef.value) return

  if (!document.fullscreenElement) {
    await cardRef.value.requestFullscreen()
    isFullscreen.value = true
    return
  }

  await document.exitFullscreen()
  isFullscreen.value = false
}

const handleFullscreenChange = () => {
  isFullscreen.value = Boolean(document.fullscreenElement)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === '+') zoomIn()
  if (event.key === '-') zoomOut()
  if (event.key.toLowerCase() === 'r') resetView()
  if (event.key.toLowerCase() === 'l') setDrawMode('trend')
  if (event.key.toLowerCase() === 'h') setDrawMode('horizontal')
  if (event.key.toLowerCase() === 'v') setDrawMode('vertical')
  if (event.key.toLowerCase() === 'c') clearDrawings()
  if (event.key === 'Backspace') removeLastDrawing()
  if (event.key.toLowerCase() === 'f') toggleFullscreen()
  if (event.key === 'Escape') setDrawMode('none')
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  document.addEventListener('fullscreenchange', handleFullscreenChange)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
})
</script>

<template>
  <section ref="cardRef" class="advanced-chart">
    <div class="advanced-chart__top">
      <div>
        <p class="advanced-chart__ticker">{{ company.ticker }}</p>
        <h2 class="advanced-chart__title">{{ company.name }}</h2>
      </div>

      <div class="advanced-chart__stats">
        <p class="advanced-chart__price">{{ formatPrice(currentPrice) }}</p>
        <p class="advanced-chart__change">
          {{ priceChange > 0 ? '+' : '' }}{{ formatPrice(priceChange) }}
          ({{ priceChange > 0 ? '+' : '' }}{{ priceChangePercent.toFixed(2) }}%)
        </p>
      </div>
    </div>

    <div class="advanced-chart__toolbar">
      <div class="toolbar-group">
        <button
          v-for="item in ['1D', '1W', '1M', '3M']"
          :key="item"
          class="toolbar-btn"
          :class="{ active: timeframe === item }"
          @click="setTimeframe(item as '1D' | '1W' | '1M' | '3M')"
        >
          {{ item }}
        </button>
      </div>

      <div class="toolbar-group">
        <button class="toolbar-btn" @click="zoomOut">-</button>
        <button class="toolbar-btn" @click="zoomIn">+</button>
        <button class="toolbar-btn" @click="resetView">Reset</button>
      </div>

      <div class="toolbar-group">
        <button
          class="toolbar-btn"
          :class="{ active: drawMode === 'trend' }"
          @click="setDrawMode('trend')"
        >
          Лінія
        </button>

        <button
          class="toolbar-btn"
          :class="{ active: drawMode === 'horizontal' }"
          @click="setDrawMode('horizontal')"
        >
          Горизонталь
        </button>

        <button
          class="toolbar-btn"
          :class="{ active: drawMode === 'vertical' }"
          @click="setDrawMode('vertical')"
        >
          Вертикаль
        </button>

        <button class="toolbar-btn" @click="removeLastDrawing">Назад</button>
        <button class="toolbar-btn" @click="clearDrawings">Очистити</button>
      </div>

      <div class="toolbar-group">
        <button
          class="toolbar-btn"
          :class="{ active: isLive }"
          @click="toggleLive"
        >
          Live
        </button>

        <button
          class="toolbar-btn"
          :class="{ active: isFullscreen }"
          @click="toggleFullscreen"
        >
          Fullscreen
        </button>
      </div>

      <span class="toolbar-zoom">Zoom: {{ zoom.toFixed(2) }}x</span>
    </div>

    <div class="advanced-chart__hotkeys">
      R — reset · L — trend · H — horizontal · V — vertical · C — clear · F — fullscreen · Backspace — delete last
    </div>

    <div class="advanced-chart__legend">
      <span class="legend-item">
        <span class="legend-dot legend-dot--price"></span>
        Price
      </span>

      <span class="legend-item">
        <span class="legend-dot legend-dot--ma7"></span>
        MA7
      </span>

      <span class="legend-item">
        <span class="legend-dot legend-dot--ma14"></span>
        MA14
      </span>
    </div>

    <div class="advanced-chart__body">
      <svg
        ref="svgRef"
        class="advanced-chart__svg"
        :viewBox="`0 0 ${chartWidth} ${chartHeight}`"
        preserveAspectRatio="none"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
        @mouseleave="handleMouseLeave"
        @dblclick="resetView"
        @wheel="handleWheel"
      >
        <defs>
          <linearGradient id="advancedChartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="rgba(124, 58, 237, 0.35)" />
            <stop offset="100%" stop-color="rgba(124, 58, 237, 0)" />
          </linearGradient>
        </defs>

        <line
          v-for="line in gridLines"
          :key="line.y"
          :x1="paddingLeft"
          :y1="line.y"
          :x2="chartWidth - paddingRight"
          :y2="line.y"
          class="grid-line"
        />

        <text
          v-for="line in gridLines"
          :key="`label-${line.y}`"
          :x="chartWidth - paddingRight + 8"
          :y="line.y + 4"
          class="price-label"
        >
          {{ line.value.toFixed(2) }}
        </text>

        <path :d="areaPath" fill="url(#advancedChartFill)" />
        <path :d="linePath" class="chart-line" />
        <path :d="ma7Path" class="ma-line ma-line--ma7" />
        <path :d="ma14Path" class="ma-line ma-line--ma14" />

        <line
          :x1="paddingLeft"
          :y1="hover.visible ? hover.y : paddingTop"
          :x2="chartWidth - paddingRight"
          :y2="hover.visible ? hover.y : paddingTop"
          class="crosshair-line"
          :class="{ 'crosshair-line--hidden': !hover.visible }"
        />

        <line
          :x1="hover.visible ? hover.x : paddingLeft"
          :y1="paddingTop"
          :x2="hover.visible ? hover.x : paddingLeft"
          :y2="chartHeight - paddingBottom"
          class="crosshair-line"
          :class="{ 'crosshair-line--hidden': !hover.visible }"
        />

        <line
          :x1="paddingLeft"
          :y1="lastPriceY"
          :x2="chartWidth - paddingRight"
          :y2="lastPriceY"
          class="last-price-line"
        />

        <line
          v-for="shape in drawings"
          :key="shape.id"
          :x1="shape.start.x"
          :y1="shape.start.y"
          :x2="shape.end.x"
          :y2="shape.end.y"
          class="draw-line"
        />

        <line
          v-if="draftShape"
          :x1="draftShape.start.x"
          :y1="draftShape.start.y"
          :x2="draftShape.end.x"
          :y2="draftShape.end.y"
          class="draw-line draw-line--draft"
        />

        <circle
          v-if="hover.visible"
          :cx="hover.x"
          :cy="hover.y"
          r="5"
          class="hover-point"
        />
      </svg>

      <div class="time-labels">
        <span
          v-for="item in timeLabels"
          :key="`${item.index}-${item.time}`"
          class="time-label"
        >
          {{ item.time }}
        </span>
      </div>

      <div
        v-if="hoverPoint && hover.visible"
        class="chart-tooltip"
        :style="{
          left: `${Math.min(hover.x + 18, chartWidth - 220)}px`,
          top: `${Math.max(hover.y - 18, 18)}px`,
        }"
      >
        <p class="chart-tooltip__title">{{ company.ticker }}</p>
        <p class="chart-tooltip__row">Час: {{ hoverPoint.time }}</p>
        <p class="chart-tooltip__row">Ціна: {{ formatPrice(hoverPoint.value) }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.advanced-chart {
  width: 100%;
  padding: 24px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--glass-border);
  background: #0f1117;
  box-shadow: var(--shadow-glass);
}

.advanced-chart__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 20px;
}

.advanced-chart__ticker {
  margin: 0 0 6px;
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

.advanced-chart__title {
  margin: 0;
  color: var(--text-primary);
  font-size: 28px;
  font-weight: 800;
}

.advanced-chart__stats {
  text-align: right;
}

.advanced-chart__price {
  margin: 0 0 6px;
  color: var(--text-primary);
  font-size: 30px;
  font-weight: 800;
}

.advanced-chart__change {
  margin: 0;
  color: var(--accent);
  font-size: var(--text-sm);
  font-weight: 600;
}

.advanced-chart__toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toolbar-btn {
  min-height: 42px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  color: var(--text-primary);
  cursor: pointer;
  transition: 0.2s ease;
}

.toolbar-btn:hover {
  border-color: var(--accent);
}

.toolbar-btn.active {
  background: var(--accent);
  border-color: var(--accent);
  color: white;
}

.toolbar-zoom {
  color: var(--text-secondary);
  font-size: var(--text-sm);
  margin-left: auto;
}

.advanced-chart__hotkeys {
  margin-bottom: 14px;
  color: var(--text-secondary);
  font-size: 12px;
}

.advanced-chart__legend {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 14px;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 13px;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.legend-dot--price {
  background: var(--accent);
}

.legend-dot--ma7 {
  background: #22c55e;
}

.legend-dot--ma14 {
  background: #f59e0b;
}

.advanced-chart__body {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.06);
  background: #090b12;
}

.advanced-chart__svg {
  width: 100%;
  height: 560px;
  display: block;
  cursor: crosshair;
}

.grid-line {
  stroke: rgba(255, 255, 255, 0.08);
  stroke-width: 1;
}

.price-label {
  fill: var(--text-secondary);
  font-size: 12px;
}

.chart-line {
  fill: none;
  stroke: var(--accent);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.ma-line {
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.ma-line--ma7 {
  stroke: #22c55e;
}

.ma-line--ma14 {
  stroke: #f59e0b;
}

.crosshair-line {
  stroke: rgba(255, 255, 255, 0.22);
  stroke-width: 1;
  stroke-dasharray: 6 6;
}

.crosshair-line--hidden {
  opacity: 0;
}

.last-price-line {
  stroke: rgba(124, 58, 237, 0.55);
  stroke-width: 1.5;
  stroke-dasharray: 10 6;
}

.draw-line {
  stroke: #facc15;
  stroke-width: 2.5;
  stroke-linecap: round;
}

.draw-line--draft {
  stroke-dasharray: 8 6;
}

.hover-point {
  fill: white;
  stroke: var(--accent);
  stroke-width: 3;
}

.time-labels {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 16px 14px;
}

.time-label {
  color: var(--text-secondary);
  font-size: 12px;
}

.chart-tooltip {
  position: absolute;
  min-width: 170px;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid var(--glass-border);
  background: rgba(15, 17, 23, 0.96);
  box-shadow: var(--shadow-glass);
  pointer-events: none;
}

.chart-tooltip__title {
  margin: 0 0 8px;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 700;
}

.chart-tooltip__row {
  margin: 0;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.5;
}

@media (max-width: 900px) {
  .advanced-chart {
    padding: 16px;
  }

  .advanced-chart__top {
    flex-direction: column;
  }

  .advanced-chart__stats {
    text-align: left;
  }

  .advanced-chart__svg {
    height: 420px;
  }

  .toolbar-zoom {
    width: 100%;
    margin-left: 0;
  }

  .advanced-chart__legend {
    flex-wrap: wrap;
  }
}
</style>