<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-[#00D1FF]">Play Time Tracker</h2>
      <div class="flex items-center space-x-4">
        <select 
          v-model="timeRange"
          class="bg-[#0F172A] border border-gray-700 rounded-lg px-4 py-2"
        >
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="all">All Time</option>
        </select>
        <button @click="exportStats" class="btn btn-secondary">
          Export Stats
        </button>
      </div>
    </div>

    <div class="space-y-6">
      <!-- Summary Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="text-sm text-gray-400">Total Play Time</div>
          <div class="text-2xl font-bold text-[#00D1FF]">{{ formatTime(stats.totalPlayTime) }}</div>
        </div>
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="text-sm text-gray-400">Average Session</div>
          <div class="text-2xl font-bold text-[#00D1FF]">{{ formatTime(stats.avgSessionTime) }}</div>
        </div>
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="text-sm text-gray-400">Peak Players</div>
          <div class="text-2xl font-bold text-[#00D1FF]">{{ stats.peakPlayers }}</div>
        </div>
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="text-sm text-gray-400">Active Players</div>
          <div class="text-2xl font-bold text-[#00D1FF]">{{ stats.activePlayers }}</div>
        </div>
      </div>

      <!-- Player List -->
      <div class="bg-[#0F172A] rounded-lg border border-gray-800">
        <div class="p-4 border-b border-gray-800">
          <div class="flex justify-between items-center">
            <h3 class="font-medium">Player Statistics</h3>
            <input 
              v-model="searchQuery"
              type="text"
              placeholder="Search players..."
              class="bg-[#1E293B] border border-gray-700 rounded-lg px-4 py-2"
            />
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-left text-sm text-gray-400 border-b border-gray-800">
                <th class="p-4">Player</th>
                <th class="p-4">Total Time</th>
                <th class="p-4">Sessions</th>
                <th class="p-4">Last Seen</th>
                <th class="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="player in filteredPlayers" 
                  :key="player.username"
                  class="border-b border-gray-800 hover:bg-[#1E293B]">
                <td class="p-4">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 rounded-full bg-[#2E3B4B] flex items-center justify-center">
                      <span class="text-sm font-medium">{{ player.username[0].toUpperCase() }}</span>
                    </div>
                    <span class="text-gray-100">{{ player.username }}</span>
                  </div>
                </td>
                <td class="p-4 text-gray-300">{{ formatTime(player.totalTime) }}</td>
                <td class="p-4 text-gray-300">{{ player.sessions }}</td>
                <td class="p-4 text-gray-400">{{ formatTimeAgo(player.lastSeen) }}</td>
                <td class="p-4">
                  <span :class="{
                    'text-green-400': player.online,
                    'text-gray-400': !player.online
                  }">{{ player.online ? 'Online' : 'Offline' }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Session History -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Recent Sessions</h3>
        <div class="space-y-2">
          <div v-for="session in recentSessions" 
               :key="session.id"
               class="flex items-center justify-between py-2">
            <div>
              <div class="text-gray-100">{{ session.player }}</div>
              <div class="text-sm text-gray-400 mt-1">
                Duration: {{ formatTime(session.duration) }}
              </div>
            </div>
            <div class="text-sm text-gray-500">
              {{ formatTimeAgo(session.endTime) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { formatDistanceToNow } from 'date-fns';

interface PlayerStats {
  username: string;
  totalTime: number;
  sessions: number;
  lastSeen: Date;
  online: boolean;
}

interface Session {
  id: string;
  player: string;
  duration: number;
  endTime: Date;
}

const timeRange = ref('24h');
const searchQuery = ref('');

const stats = ref({
  totalPlayTime: 3600 * 1000, // 1000 hours
  avgSessionTime: 3600 * 2, // 2 hours
  peakPlayers: 25,
  activePlayers: 12
});

const players = ref<PlayerStats[]>([
  {
    username: 'Player1',
    totalTime: 3600 * 100, // 100 hours
    sessions: 50,
    lastSeen: new Date(),
    online: true
  },
  {
    username: 'Player2',
    totalTime: 3600 * 75, // 75 hours
    sessions: 30,
    lastSeen: new Date(Date.now() - 3600000),
    online: false
  }
]);

const recentSessions = ref<Session[]>([
  {
    id: '1',
    player: 'Player1',
    duration: 3600 * 2, // 2 hours
    endTime: new Date()
  },
  {
    id: '2',
    player: 'Player2',
    duration: 3600 * 1.5, // 1.5 hours
    endTime: new Date(Date.now() - 3600000)
  }
]);

const filteredPlayers = computed(() => {
  if (!searchQuery.value) return players.value;
  const query = searchQuery.value.toLowerCase();
  return players.value.filter(player => 
    player.username.toLowerCase().includes(query)
  );
});

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours === 0) {
    return `${minutes}m`;
  }
  return `${hours}h ${minutes}m`;
}

function formatTimeAgo(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

function exportStats() {
  // Implement stats export functionality
  console.log('Exporting play time stats');
}
</script>