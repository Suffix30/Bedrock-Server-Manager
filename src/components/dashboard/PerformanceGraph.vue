<template>
  <div class="card p-6">
    <h2 class="text-2xl font-bold mb-6 text-[#00D1FF]">Performance History</h2>
    
    <div class="space-y-6">
      <!-- Time Range Selector -->
      <div class="flex space-x-4">
        <button 
          v-for="range in timeRanges"
          :key="range.value"
          @click="currentRange = range.value"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            currentRange === range.value
              ? 'bg-[#00D1FF] text-[#0F172A]'
              : 'bg-[#1E293B] text-gray-400 hover:text-gray-300'
          ]"
        >
          {{ range.label }}
        </button>
      </div>

      <!-- Resource Graphs -->
      <div class="space-y-4">
        <!-- CPU Usage -->
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <h3 class="font-medium mb-4">CPU Usage</h3>
          <div class="h-48">
            <canvas ref="cpuChart"></canvas>
          </div>
          <div class="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <div class="text-sm text-gray-400">Average</div>
              <div class="text-lg font-medium text-[#00D1FF]">{{ stats.cpu.avg }}%</div>
            </div>
            <div>
              <div class="text-sm text-gray-400">Peak</div>
              <div class="text-lg font-medium text-[#00D1FF]">{{ stats.cpu.peak }}%</div>
            </div>
            <div>
              <div class="text-sm text-gray-400">Current</div>
              <div class="text-lg font-medium text-[#00D1FF]">{{ stats.cpu.current }}%</div>
            </div>
          </div>
        </div>

        <!-- Memory Usage -->
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <h3 class="font-medium mb-4">Memory Usage</h3>
          <div class="h-48">
            <canvas ref="memoryChart"></canvas>
          </div>
          <div class="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <div class="text-sm text-gray-400">Average</div>
              <div class="text-lg font-medium text-[#00D1FF]">{{ formatMemory(stats.memory.avg) }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-400">Peak</div>
              <div class="text-lg font-medium text-[#00D1FF]">{{ formatMemory(stats.memory.peak) }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-400">Current</div>
              <div class="text-lg font-medium text-[#00D1FF]">{{ formatMemory(stats.memory.current) }}</div>
            </div>
          </div>
        </div>

        <!-- TPS -->
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <h3 class="font-medium mb-4">TPS (Ticks Per Second)</h3>
          <div class="h-48">
            <canvas ref="tpsChart"></canvas>
          </div>
          <div class="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <div class="text-sm text-gray-400">Average</div>
              <div class="text-lg font-medium text-[#00D1FF]">{{ stats.tps.avg.toFixed(1) }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-400">Peak</div>
              <div class="text-lg font-medium text-[#00D1FF]">{{ stats.tps.peak.toFixed(1) }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-400">Current</div>
              <div class="text-lg font-medium text-[#00D1FF]">{{ stats.tps.current.toFixed(1) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Chart from 'chart.js/auto';
import { useMainStore } from '../../stores/mainStore';

const store = useMainStore();
const timeRanges = [
  { label: '1 Hour', value: '1h' },
  { label: '6 Hours', value: '6h' },
  { label: '24 Hours', value: '24h' }
];

const currentRange = ref('1h');
const cpuChart = ref<HTMLCanvasElement | null>(null);
const memoryChart = ref<HTMLCanvasElement | null>(null);
const tpsChart = ref<HTMLCanvasElement | null>(null);

let charts: { [key: string]: Chart } = {};
let updateInterval: NodeJS.Timer;

const stats = ref({
  cpu: {
    avg: 0,
    peak: 0,
    current: 0,
    history: [] as number[]
  },
  memory: {
    avg: 0,
    peak: 0,
    current: 0,
    history: [] as number[]
  },
  tps: {
    avg: 20,
    peak: 20,
    current: 20,
    history: [] as number[]
  }
});

function createChart(canvas: HTMLCanvasElement, label: string, color: string) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const labels = Array.from({ length: 60 }, (_, i) => `${-59 + i}s`);
  
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label,
        data: Array(60).fill(0),
        borderColor: color,
        tension: 0.4,
        fill: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        },
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        }
      },
      animation: {
        duration: 0
      }
    }
  });
}

function updateCharts() {
  const { cpu, memory, tps } = store.stats;

  // Update CPU data
  stats.value.cpu.current = cpu;
  stats.value.cpu.history.push(cpu);
  stats.value.cpu.peak = Math.max(stats.value.cpu.peak, cpu);
  stats.value.cpu.avg = calculateAverage(stats.value.cpu.history);

  // Update Memory data
  stats.value.memory.current = memory;
  stats.value.memory.history.push(memory);
  stats.value.memory.peak = Math.max(stats.value.memory.peak, memory);
  stats.value.memory.avg = calculateAverage(stats.value.memory.history);

  // Update TPS data
  stats.value.tps.current = tps;
  stats.value.tps.history.push(tps);
  stats.value.tps.peak = Math.max(stats.value.tps.peak, tps);
  stats.value.tps.avg = calculateAverage(stats.value.tps.history);

  // Keep only last 60 data points
  const maxDataPoints = 60;
  if (stats.value.cpu.history.length > maxDataPoints) {
    stats.value.cpu.history = stats.value.cpu.history.slice(-maxDataPoints);
    stats.value.memory.history = stats.value.memory.history.slice(-maxDataPoints);
    stats.value.tps.history = stats.value.tps.history.slice(-maxDataPoints);
  }

  // Update charts
  if (charts.cpu) {
    charts.cpu.data.datasets[0].data = [...stats.value.cpu.history];
    charts.cpu.update();
  }
  if (charts.memory) {
    charts.memory.data.datasets[0].data = [...stats.value.memory.history];
    charts.memory.update();
  }
  if (charts.tps) {
    charts.tps.data.datasets[0].data = [...stats.value.tps.history];
    charts.tps.update();
  }
}

function calculateAverage(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function formatMemory(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

onMounted(() => {
  if (cpuChart.value) {
    charts.cpu = createChart(cpuChart.value, 'CPU Usage (%)', '#00D1FF');
  }
  if (memoryChart.value) {
    charts.memory = createChart(memoryChart.value, 'Memory Usage (MB)', '#10B981');
  }
  if (tpsChart.value) {
    charts.tps = createChart(tpsChart.value, 'TPS', '#F59E0B');
  }

  // Update every second
  updateInterval = setInterval(updateCharts, 1000);
});

onUnmounted(() => {
  clearInterval(updateInterval);
  Object.values(charts).forEach(chart => chart.destroy());
});
</script>