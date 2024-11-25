<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-[#00D1FF]">Traffic Analyzer</h2>
      <div class="flex items-center space-x-4">
        <select 
          v-model="timeRange"
          class="bg-[#0F172A] border border-gray-700 rounded-lg px-4 py-2"
        >
          <option value="1h">Last Hour</option>
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
        </select>
        <button @click="generateReport" class="btn btn-primary">
          Generate Report
        </button>
      </div>
    </div>

    <div class="space-y-6">
      <!-- Traffic Overview -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="text-sm text-gray-400">Total Packets</div>
          <div class="text-2xl font-bold text-[#00D1FF]">{{ formatNumber(stats.totalPackets) }}</div>
          <div class="text-sm text-gray-500">{{ stats.packetsPerSecond }}/s</div>
        </div>
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="text-sm text-gray-400">Packet Loss</div>
          <div class="text-2xl font-bold" :class="stats.packetLoss < 1 ? 'text-green-400' : 'text-red-400'">
            {{ stats.packetLoss }}%
          </div>
          <div class="text-sm text-gray-500">Last 5 minutes</div>
        </div>
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="text-sm text-gray-400">Average Latency</div>
          <div class="text-2xl font-bold text-[#00D1FF]">{{ stats.avgLatency }}ms</div>
          <div class="text-sm text-gray-500">Peak: {{ stats.peakLatency }}ms</div>
        </div>
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="text-sm text-gray-400">Protocol Distribution</div>
          <div class="text-2xl font-bold text-[#00D1FF]">{{ stats.mainProtocol }}</div>
          <div class="text-sm text-gray-500">{{ stats.protocolPercentage }}%</div>
        </div>
      </div>

      <!-- Traffic Graph -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Traffic Pattern</h3>
        <div class="h-64">
          <canvas ref="trafficChart"></canvas>
        </div>
      </div>

      <!-- Protocol Analysis -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Protocol Analysis</h3>
        <div class="space-y-4">
          <div v-for="protocol in protocols" 
               :key="protocol.name"
               class="flex items-center">
            <div class="flex-1">
              <div class="flex items-center justify-between mb-1">
                <span class="text-gray-100">{{ protocol.name }}</span>
                <span class="text-gray-400">{{ protocol.percentage }}%</span>
              </div>
              <div class="w-full bg-gray-800 rounded-full h-2">
                <div class="bg-[#00D1FF] h-2 rounded-full transition-all duration-500"
                     :style="{ width: `${protocol.percentage}%` }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Anomaly Detection -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Anomaly Detection</h3>
        <div class="space-y-2">
          <div v-for="anomaly in anomalies" 
               :key="anomaly.id"
               :class="{
                 'bg-red-900/20 border-red-700': anomaly.severity === 'high',
                 'bg-yellow-900/20 border-yellow-700': anomaly.severity === 'medium',
                 'bg-blue-900/20 border-blue-700': anomaly.severity === 'low'
               }"
               class="p-4 rounded-lg border">
            <div class="flex items-start space-x-3">
              <div :class="{
                'text-red-400': anomaly.severity === 'high',
                'text-yellow-400': anomaly.severity === 'medium',
                'text-blue-400': anomaly.severity === 'low'
              }">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <div class="font-medium text-gray-100">{{ anomaly.title }}</div>
                <div class="text-sm text-gray-400 mt-1">{{ anomaly.description }}</div>
                <div class="text-sm text-gray-500 mt-2">{{ formatTimeAgo(anomaly.timestamp) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Chart } from 'chart.js/auto';
import { formatDistanceToNow } from 'date-fns';

const timeRange = ref('1h');
const trafficChart = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

const stats = ref({
  totalPackets: 1234567,
  packetsPerSecond: 150,
  packetLoss: 0.5,
  avgLatency: 45,
  peakLatency: 120,
  mainProtocol: 'UDP',
  protocolPercentage: 85
});

const protocols = ref([
  { name: 'UDP', percentage: 85 },
  { name: 'TCP', percentage: 10 },
  { name: 'ICMP', percentage: 5 }
]);

const anomalies = ref([
  {
    id: '1',
    title: 'Unusual Traffic Spike',
    description: 'Detected abnormal increase in UDP traffic from IP 192.168.1.100',
    severity: 'high',
    timestamp: new Date(Date.now() - 300000)
  },
  {
    id: '2',
    title: 'Increased Latency',
    description: 'Average latency increased by 50% in the last 5 minutes',
    severity: 'medium',
    timestamp: new Date(Date.now() - 900000)
  }
]);

function createChart() {
  if (!trafficChart.value) return;

  chart = new Chart(trafficChart.value, {
    type: 'line',
    data: {
      labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      datasets: [
        {
          label: 'Packets/s',
          data: Array.from({ length: 24 }, () => Math.random() * 200 + 100),
          borderColor: '#00D1FF',
          tension: 0.4
        },
        {
          label: 'Latency (ms)',
          data: Array.from({ length: 24 }, () => Math.random() * 50 + 20),
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
      }
    }
  });
}

function formatNumber(num: number): string {
  return num.toLocaleString();
}

function formatTimeAgo(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

function generateReport() {
  // Implement report generation
  console.log('Generating traffic analysis report');
}

// Update stats periodically
let updateInterval: NodeJS.Timer;

function updateStats() {
  stats.value.packetsPerSecond = Math.floor(Math.random() * 50 + 100);
  stats.value.totalPackets += stats.value.packetsPerSecond;
  stats.value.avgLatency = Math.floor(Math.random() * 20 + 35);
  
  if (stats.value.avgLatency > stats.value.peakLatency) {
    stats.value.peakLatency = stats.value.avgLatency;
  }
}

onMounted(() => {
  createChart();
  updateInterval = setInterval(updateStats, 1000);
});

onUnmounted(() => {
  if (chart) {
    chart.destroy();
  }
  clearInterval(updateInterval);
});
</script>