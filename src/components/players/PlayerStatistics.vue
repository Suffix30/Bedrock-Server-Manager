<template>
  <div class="card p-6">
    <h2 class="text-2xl font-bold mb-6 text-[#00D1FF]">Player Statistics</h2>
    
    <div class="space-y-6">
      <!-- Player Search -->
      <div class="flex space-x-4">
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="Search players..."
          class="flex-1"
        />
        <select 
          v-model="sortBy"
          class="bg-[#0F172A] border border-gray-700 rounded-lg px-4 py-2"
        >
          <option value="playtime">Sort by Playtime</option>
          <option value="lastSeen">Sort by Last Seen</option>
          <option value="joinDate">Sort by Join Date</option>
        </select>
      </div>

      <!-- Player List -->
      <div class="space-y-4">
        <div v-for="player in sortedPlayers" 
             :key="player.id"
             class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 rounded-full bg-[#2E3B4B] flex items-center justify-center">
                <span class="text-lg font-medium">{{ player.username[0].toUpperCase() }}</span>
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-100">{{ player.username }}</h3>
                <div class="flex items-center space-x-2 mt-1">
                  <span :class="player.online ? 'text-green-400' : 'text-gray-400'">
                    {{ player.online ? 'Online' : 'Offline' }}
                  </span>
                  <span class="text-gray-600">•</span>
                  <span class="text-gray-400">
                    {{ player.online ? 'Connected' : `Last seen ${formatLastSeen(player.lastSeen)}` }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="text-right">
              <div class="text-[#00D1FF] font-medium">
                {{ formatPlaytime(player.playTime) }}
              </div>
              <div class="text-sm text-gray-400">
                Joined {{ formatDate(player.joinDate) }}
              </div>
            </div>
          </div>

          <!-- Detailed Stats -->
          <div class="grid grid-cols-4 gap-4 mt-4 p-4 bg-[#1E293B] rounded-lg">
            <div>
              <div class="text-sm text-gray-400">Deaths</div>
              <div class="text-lg font-medium text-gray-100">{{ player.stats.deaths }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-400">Blocks Broken</div>
              <div class="text-lg font-medium text-gray-100">{{ formatNumber(player.stats.blocksBroken) }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-400">Mobs Killed</div>
              <div class="text-lg font-medium text-gray-100">{{ formatNumber(player.stats.mobsKilled) }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-400">Distance Traveled</div>
              <div class="text-lg font-medium text-gray-100">{{ formatDistance(player.stats.distanceTraveled) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { formatDistanceToNow, format } from 'date-fns';

interface PlayerStats {
  deaths: number;
  blocksBroken: number;
  mobsKilled: number;
  distanceTraveled: number;
}

interface Player {
  id: string;
  username: string;
  online: boolean;
  lastSeen: Date;
  joinDate: Date;
  playTime: number;
  stats: PlayerStats;
}

const searchQuery = ref('');
const sortBy = ref('playtime');

const players = ref<Player[]>([
  {
    id: '1',
    username: 'Steve',
    online: true,
    lastSeen: new Date(),
    joinDate: new Date(Date.now() - 7776000000), // 90 days ago
    playTime: 360000, // 100 hours
    stats: {
      deaths: 42,
      blocksBroken: 15789,
      mobsKilled: 873,
      distanceTraveled: 456789
    }
  },
  // Add more sample players
]);

const sortedPlayers = computed(() => {
  let filtered = players.value.filter(player => 
    player.username.toLowerCase().includes(searchQuery.value.toLowerCase())
  );

  return filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'playtime':
        return b.playTime - a.playTime;
      case 'lastSeen':
        return b.lastSeen.getTime() - a.lastSeen.getTime();
      case 'joinDate':
        return b.joinDate.getTime() - a.joinDate.getTime();
      default:
        return 0;
    }
  });
});

function formatLastSeen(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

function formatPlaytime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

function formatDate(date: Date): string {
  return format(date, 'MMM d, yyyy');
}

function formatNumber(num: number): string {
  return num.toLocaleString();
}

function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${meters}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}
</script>