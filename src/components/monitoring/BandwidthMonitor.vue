<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-[#00D1FF]">Bandwidth Monitor</h2>
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
        <button @click="exportData" class="btn btn-secondary">
          Export Data
        </button>
      </div>
    </div>

    <div class="space-y-6">
      <!-- Real-time Bandwidth Usage -->
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="text-sm text-gray-400">Download Speed</div>
          <div class="text-2xl font-bold text-[#00D1FF]">{{ formatSpeed(stats.downloadSpeed) }}</div>
          <div class="text-sm text-gray-500">Peak: {{ formatSpeed(stats.peakDownload) }}</div>
        </div>
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="text-sm text-gray-400">Upload Speed</div>
          <div class="text-2xl font-bold text-[#00D1FF]">{{ formatSpeed(stats.uploadSpeed) }}</div>
          <div class="text-sm text-gray-500">Peak: {{ formatSpeed(stats.peakUpload) }}</div>
        </div>
      </div>

      <!-- Bandwidth Graph -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Usage Over Time</h3>
        <div class="h-64">
          <canvas ref="bandwidthChart"></canvas>
        </div>
      </div>

      <!-- Total Usage -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="text-sm text-gray-400">Total Download</div>
          <div class="text-2xl font-bold text-[#00D1FF]">{{ formatBytes(stats.totalDownload) }}</div>
        </div>
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="text-sm text-gray-400">Total Upload</div>
          <div class="text-2xl font-bold text-[#00D1FF]">{{ formatBytes(stats.totalUpload) }}</div>
        </div>
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="text-sm text-gray-400">Active Connections</div>
          <div class="text-2xl font-bold text-[#00D1FF]">{{ stats.activeConnections }}</div>
        </div>
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="text-sm text-gray-400">Bandwidth Usage</div>
          <div class="text-2xl font-bold text-[#00D1FF]">{{ stats.usagePercentage }}%</div>
        </div>
      </div>

      <!-- Per-Player Usage -->
      <div class="bg-[#0F172A] rounded-lg border border-gray-800">
        <div class="p-4 border-b border-gray-800">
          <h3 class="font-medium">Player Bandwidth Usage</h3>
        </div>
        <div class="divide-y divide-gray-800">
          <div v-for="player in playerUsage" 
               :key="player.name"
               class="p-4 flex items-center justify-between">
            <div>
              <div class="text-gray-100">{{ player.name }}</div>
              <div class="text-sm text-gray-400 mt-1">
                Download: {{ formatBytes(player.download) }} • 
                Upload: {{ formatBytes(player.upload) }}
              </div>
            </div>
            <div class="text-sm text-gray-400">
              {{ formatTimeAgo(player.lastActivity) }}
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

interface PlayerUsage {
  name: string;
  download: number;
  upload: number;
  lastActivity: Date;
}

const timeRange = ref('1h');
const bandwidthChart = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

const stats = ref({
  downloadSpeed: 1024 * 1024 * 2, // 2 MB/s
  uploadSpeed: 1024 * 1024, // 1 MB/s
  peakDownload: 1024 * 1024 * 5, // 5 MB/s
  peakUpload: 1024 * 1024 * 3, // 3 MB/s
  totalDownload: 1024 * 1024 * 1024 * 50, // 50 GB
  totalUpload: 1024 * 1024 * 1024 * 30, // 30 GB
  activeConnections: 10,
  usagePercentage: 45
});

const playerUsage = ref<PlayerUsage[]>([
  {
    name: 'Player1',
    download: 1024 * 1024 * 500, // 500 MB
    upload: 1024 * 1024 * 200, // 200 MB
    lastActivity: new Date(Date.now() - 300000)
  },
  {
    name: 'Player2',
    download: 1024 * 1024 * 300, // 300 MB
    upload: 1024 * 1024 * 150, // 150 MB
    lastActivity: new Date(Date.now() - 600000)
  }
]);

function createChart() {
  if (!bandwidthChart.value) return;

  chart = new Chart(bandwidthChart.value, {
    type: 'line',
    data: {
      labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      datasets: [
        {
          label: 'Download',
          data: Array.from({ length: 24 }, () => Math.random() * 5),
          borderColor: '#00D1FF',
          tension: 0.4
        },
        {
          label: 'Upload',
          data: Array.from({ length: 24 }, () => Math.random() * 3),
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

function formatSpeed(bytesPerSecond: number): string {
  return `${formatBytes(bytesPerSecond)}/s`;
}

function formatTimeAgo(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

function exportData() {
  // Implement data export functionality
  console.log('Exporting bandwidth data');
}

// Update stats periodically
let updateInterval: NodeJS.Timer;

function updateStats() {
  stats.value.downloadSpeed = Math.random() * 1024 * 1024 * 3; // 0-3 MB/s
  stats.value.uploadSpeed = Math.random() * 1024 * 1024 * 2; // 0-2 MB/s
  
  if (stats.value.downloadSpeed > stats.value.peakDownload) {
    stats.value.peakDownload = stats.value.downloadSpeed;
  }
  if (stats.value.uploadSpeed > stats.value.peakUpload) {
    stats.value.peakUpload = stats.value.uploadSpeed;
  }
  
  stats.value.totalDownload += stats.value.downloadSpeed;
  stats.value.totalUpload += stats.value.uploadSpeed;
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