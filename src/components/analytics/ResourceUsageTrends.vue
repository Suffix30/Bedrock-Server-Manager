<template>
  <div class="card p-6">
    <h2 class="text-2xl font-bold mb-6 text-[#00D1FF]">Resource Usage Trends</h2>
    
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

        <!-- Network Usage -->
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <h3 class="font-medium mb-4">Network Usage</h3>
          <div class="h-48">
            <canvas ref="networkChart"></canvas>
          </div>
          <div class="mt-4 grid grid-cols-2 gap-4 text-center">
            <div>
              <div class="text-sm text-gray-400">Total In</div>
              <div class="text-lg font-medium text-[#00D1FF]">{{ formatBytes(stats.network.totalIn) }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-400">Total Out</div>
              <div class="text-lg font-medium text-[#00D1FF]">{{ formatBytes(stats.network.totalOut) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';

const timeRanges = [
  { label: '24 Hours', value: '24h' },
  { label: '7 Days', value: '7d' },
  { label: '30 Days', value: '30d' }
];

const currentRange = ref('24h');

const stats = ref({
  cpu: {
    avg: 45,
    peak: 85,
    current: 32
  },
  memory: {
    avg: 1024 * 1024 * 1024, // 1GB
    peak: 1.5 * 1024 * 1024 * 1024, // 1.5GB
    current: 0.8 * 1024 * 1024 * 1024 // 800MB
  },
  network: {
    totalIn: 50 * 1024 * 1024 * 1024, // 50GB
    totalOut: 30 * 1024 * 1024 * 1024 // 30GB
  }
});

const cpuChart = ref<HTMLCanvasElement | null>(null);
const memoryChart = ref<HTMLCanvasElement | null>(null);
const networkChart = ref<HTMLCanvasElement | null>(null);

function formatMemory(bytes: number): string {
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)}GB`;
}

function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

function createCharts() {
  if (cpuChart.value) {
    new Chart(cpuChart.value, {
      type: 'line',
      data: {
        labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
        datasets: [{
          label: 'CPU Usage',
          data: Array.from({ length: 24 }, () => Math.random() * 100),
          borderColor: '#00D1FF',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
          },
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
          }
        }
      }
    });
  }

  if (memoryChart.value) {
    new Chart(memoryChart.value, {
      type: 'line',
      data: {
        labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
        datasets: [{
          label: 'Memory Usage',
          data: Array.from({ length: 24 }, () => Math.random() * 2048),
          borderColor: '#10B981',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
          },
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
          }
        }
      }
    });
  }

  if (networkChart.value) {
    new Chart(networkChart.value, {
      type: 'line',
      data: {
        labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
        datasets: [
          {
            label: 'Network In',
            data: Array.from({ length: 24 }, () => Math.random() * 100),
            borderColor: '#3B82F6',
            tension: 0.4
          },
          {
            label: 'Network Out',
            data: Array.from({ length: 24 }, () => Math.random() * 100),
            borderColor: '#EF4444',
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
          },
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
          }
        }
      }
    });
  }
}

onMounted(() => {
  createCharts();
});
</script>