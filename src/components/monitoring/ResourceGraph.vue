<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-[#00D1FF]">Resource Usage History</h2>
      <div class="flex space-x-4">
        <button 
          v-for="period in timePeriods"
          :key="period.value"
          @click="timeRange = period.value"
          :class="[
            'px-3 py-1 rounded-full text-sm',
            timeRange === period.value 
              ? 'bg-[#00D1FF] text-[#0F172A]'
              : 'bg-[#1E293B] text-gray-400'
          ]"
        >
          {{ period.label }}
        </button>
      </div>
    </div>

    <div class="space-y-6">
      <!-- CPU & Memory Graph -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <div class="h-64">
          <canvas ref="resourceCanvas"></canvas>
        </div>
      </div>

      <!-- Network Graph -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <div class="h-64">
          <canvas ref="networkCanvas"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { Chart } from 'chart.js/auto';
import { useMonitoringStore } from '../../stores/monitoringStore';

const store = useMonitoringStore();
const resourceCanvas = ref<HTMLCanvasElement | null>(null);
const networkCanvas = ref<HTMLCanvasElement | null>(null);
let resourceChart: Chart | null = null;
let networkChart: Chart | null = null;

const timePeriods = [
  { label: '1h', value: 60 },
  { label: '6h', value: 360 },
  { label: '24h', value: 1440 }
];

const timeRange = ref(timePeriods[0].value);

function createResourceChart() {
  if (!resourceCanvas.value) return;

  resourceChart = new Chart(resourceCanvas.value, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'CPU Usage',
          data: [],
          borderColor: '#00D1FF',
          tension: 0.4
        },
        {
          label: 'Memory Usage',
          data: [],
          borderColor: '#10B981',
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
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

function createNetworkChart() {
  if (!networkCanvas.value) return;

  networkChart = new Chart(networkCanvas.value, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Network In',
          data: [],
          borderColor: '#3B82F6',
          tension: 0.4
        },
        {
          label: 'Network Out',
          data: [],
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
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

function updateCharts() {
  if (!resourceChart || !networkChart) return;

  const data = store.historicalData.slice(-timeRange.value);
  const labels = data.map(d => 
    new Date(d.timestamp).toLocaleTimeString()
  );

  // Update resource chart
  resourceChart.data.labels = labels;
  resourceChart.data.datasets[0].data = data.map(d => d.cpu);
  resourceChart.data.datasets[1].data = data.map(d => d.memory);
  resourceChart.update();

  // Update network chart
  networkChart.data.labels = labels;
  networkChart.data.datasets[0].data = data.map(d => d.networkIn);
  networkChart.data.datasets[1].data = data.map(d => d.networkOut);
  networkChart.update();
}

watch(timeRange, updateCharts);

onMounted(() => {
  createResourceChart();
  createNetworkChart();
  updateCharts();

  // Update charts every minute
  const interval = setInterval(updateCharts, 60000);
  onUnmounted(() => clearInterval(interval));
});
</script>