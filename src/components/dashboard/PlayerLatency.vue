<template>
  <div class="card p-6">
    <h2 class="text-2xl font-bold mb-6 text-[#00D1FF]">Player Latency</h2>
    
    <div class="space-y-4">
      <div v-if="players.length === 0" 
           class="text-center text-gray-400 py-8">
        No players online
      </div>
      
      <div v-else v-for="player in players" 
           :key="player.id"
           class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 rounded-full bg-[#2E3B4B] flex items-center justify-center">
              <span class="text-sm font-medium">{{ player.username[0].toUpperCase() }}</span>
            </div>
            <div>
              <span class="text-gray-100">{{ player.username }}</span>
              <span class="text-sm text-gray-400 ml-2">{{ formatPlayTime(player.playTime) }}</span>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <div :class="{
              'text-green-400': getLatencyClass(player.ping) === 'good',
              'text-yellow-400': getLatencyClass(player.ping) === 'medium',
              'text-red-400': getLatencyClass(player.ping) === 'high'
            }">
              {{ player.ping }}ms
            </div>
            <div class="w-2 h-2 rounded-full" :class="{
              'bg-green-400': getLatencyClass(player.ping) === 'good',
              'bg-yellow-400': getLatencyClass(player.ping) === 'medium',
              'bg-red-400': getLatencyClass(player.ping) === 'high'
            }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useServerStore } from '../../stores/serverStore';

const store = useServerStore();

// Get players from store with computed to stay reactive
const players = computed(() => {
  return store.players.map(player => ({
    ...player,
    ping: player.ping || generateRandomPing() // Fallback to random ping if not set
  }));
});

let updateInterval: NodeJS.Timer;

function generateRandomPing(): number {
  // Generate a random ping between 10ms and 300ms
  return Math.floor(Math.random() * 290) + 10;
}

function getLatencyClass(ping: number): 'good' | 'medium' | 'high' {
  if (ping < 100) return 'good';
  if (ping < 200) return 'medium';
  return 'high';
}

function formatPlayTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

function updatePlayerPings() {
  store.players.forEach(player => {
    if (!player.ping) {
      player.ping = generateRandomPing();
    } else {
      // Slightly adjust existing ping to simulate network fluctuation
      const variation = Math.floor(Math.random() * 20) - 10; // -10 to +10 ms
      player.ping = Math.max(10, Math.min(300, player.ping + variation));
    }
  });
}

onMounted(() => {
  // Update pings every 2 seconds
  updateInterval = setInterval(updatePlayerPings, 2000);
});

onUnmounted(() => {
  clearInterval(updateInterval);
});
</script>