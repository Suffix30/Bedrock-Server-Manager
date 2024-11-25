<template>
  <div class="card p-6">
    <h2 class="text-2xl font-bold mb-6 text-[#00D1FF]">Server Statistics</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- CPU Usage -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <div class="flex items-center justify-between mb-2">
          <span class="text-gray-400">CPU</span>
          <span class="text-[#00D1FF] font-bold">{{ formatNumber(stats.cpu) }}%</span>
        </div>
        <div class="w-full bg-gray-800 rounded-full h-2">
          <div class="bg-[#00D1FF] h-2 rounded-full transition-all duration-500"
               :style="{ width: `${stats.cpu}%` }"></div>
        </div>
      </div>

      <!-- Memory Usage -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <div class="flex items-center justify-between mb-2">
          <span class="text-gray-400">RAM</span>
          <span class="text-[#00D1FF] font-bold">{{ formatMemory(stats.memory) }}</span>
        </div>
        <div class="w-full bg-gray-800 rounded-full h-2">
          <div class="bg-[#00D1FF] h-2 rounded-full transition-all duration-500"
               :style="{ width: `${(stats.memory / stats.maxMemory) * 100}%` }"></div>
        </div>
      </div>

      <!-- TPS -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <div class="flex items-center justify-between mb-2">
          <span class="text-gray-400">TPS</span>
          <span :class="{
            'text-[#00D1FF]': stats.tps >= 18,
            'text-yellow-500': stats.tps < 18 && stats.tps >= 10,
            'text-red-500': stats.tps < 10
          }" class="font-bold">{{ formatNumber(stats.tps) }}</span>
        </div>
        <div class="w-full bg-gray-800 rounded-full h-2">
          <div :class="{
            'bg-[#00D1FF]': stats.tps >= 18,
            'bg-yellow-500': stats.tps < 18 && stats.tps >= 10,
            'bg-red-500': stats.tps < 10
          }" class="h-2 rounded-full transition-all duration-500"
               :style="{ width: `${(stats.tps / 20) * 100}%` }"></div>
        </div>
      </div>
    </div>

    <!-- Uptime & Player Count -->
    <div class="grid grid-cols-2 gap-4 mt-4">
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <span class="text-gray-400 block">Uptime</span>
        <span class="text-[#00D1FF] text-xl font-bold">{{ formatUptime }}</span>
      </div>
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <span class="text-gray-400 block">Players</span>
        <span class="text-[#00D1FF] text-xl font-bold">{{ store.players.length }}/{{ store.settings.maxPlayers }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useServerStore } from '../stores/serverStore';

const store = useServerStore();

const stats = ref({
  cpu: 0,
  memory: 0,
  maxMemory: 2048, // 2GB
  tps: 20,
  uptime: 0
});

const formatUptime = computed(() => {
  const hours = Math.floor(stats.value.uptime / 3600);
  const minutes = Math.floor((stats.value.uptime % 3600) / 60);
  const seconds = stats.value.uptime % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
});

function formatNumber(value: number): string {
  return value.toFixed(1);
}

function formatMemory(bytes: number): string {
  const mb = Math.floor(bytes / 1024 / 1024);
  return `${mb}/${stats.value.maxMemory} MB`;
}

let interval: NodeJS.Timer;

onMounted(() => {
  interval = setInterval(() => {
    // Simulate realistic server stats
    stats.value.cpu = Math.min(100, Math.max(0, stats.value.cpu + (Math.random() * 10 - 5)));
    stats.value.memory = Math.min(stats.value.maxMemory, Math.max(200, stats.value.memory + (Math.random() * 100 - 50)));
    stats.value.tps = Math.min(20, Math.max(5, stats.value.tps + (Math.random() * 2 - 1)));
    stats.value.uptime++;
  }, 1000);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>