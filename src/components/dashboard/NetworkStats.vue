<template>
  <div class="card p-6">
    <h2 class="text-2xl font-bold mb-6 text-[#00D1FF]">Network Statistics</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Network In -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <div class="flex items-center justify-between mb-2">
          <span class="text-gray-400">Network In</span>
          <span class="text-[#00D1FF] font-bold">{{ formatSpeed(currentStats.bytesIn) }}/s</span>
        </div>
        <div class="w-full bg-gray-800 rounded-full h-2">
          <div class="bg-green-500 h-2 rounded-full transition-all duration-500"
               :style="{ width: `${Math.min((currentStats.bytesIn / maxSpeed) * 100, 100)}%` }"></div>
        </div>
        <div class="mt-2 text-sm text-gray-500">
          Total: {{ formatBytes(totalStats.totalBytesIn) }}
        </div>
      </div>

      <!-- Network Out -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <div class="flex items-center justify-between mb-2">
          <span class="text-gray-400">Network Out</span>
          <span class="text-[#00D1FF] font-bold">{{ formatSpeed(currentStats.bytesOut) }}/s</span>
        </div>
        <div class="w-full bg-gray-800 rounded-full h-2">
          <div class="bg-blue-500 h-2 rounded-full transition-all duration-500"
               :style="{ width: `${Math.min((currentStats.bytesOut / maxSpeed) * 100, 100)}%` }"></div>
        </div>
        <div class="mt-2 text-sm text-gray-500">
          Total: {{ formatBytes(totalStats.totalBytesOut) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useMonitoringStore } from '../../stores/monitoringStore';

const store = useMonitoringStore();
const maxSpeed = 1024 * 1024 * 10; // 10 MB/s

const currentStats = ref({
  bytesIn: 0,
  bytesOut: 0
});

const totalStats = ref({
  totalBytesIn: 0,
  totalBytesOut: 0
});

let updateInterval: NodeJS.Timer;

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
  return `${formatBytes(bytesPerSecond)}`;
}

function updateStats() {
  // Simulate network activity
  currentStats.value.bytesIn = Math.random() * 1024 * 1024 * 5; // 0-5 MB/s
  currentStats.value.bytesOut = Math.random() * 1024 * 1024 * 3; // 0-3 MB/s
  
  // Update totals
  totalStats.value.totalBytesIn += currentStats.value.bytesIn;
  totalStats.value.totalBytesOut += currentStats.value.bytesOut;

  // Update store
  store.networkStats.bytesInPerSecond = currentStats.value.bytesIn;
  store.networkStats.bytesOutPerSecond = currentStats.value.bytesOut;
  store.networkStats.totalBytesIn = totalStats.value.totalBytesIn;
  store.networkStats.totalBytesOut = totalStats.value.totalBytesOut;
}

onMounted(() => {
  // Initialize with store values
  totalStats.value.totalBytesIn = store.networkStats.totalBytesIn;
  totalStats.value.totalBytesOut = store.networkStats.totalBytesOut;
  
  // Start periodic updates
  updateInterval = setInterval(updateStats, 1000);
});

onUnmounted(() => {
  clearInterval(updateInterval);
});
</script>