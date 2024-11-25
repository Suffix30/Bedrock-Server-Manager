<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-[#00D1FF]">Discord Integration</h2>
      <div class="flex items-center space-x-2">
        <div class="h-2 w-2 rounded-full" 
             :class="isConnected ? 'bg-green-500' : 'bg-red-500'"></div>
        <span class="text-sm text-gray-400">{{ isConnected ? 'Connected' : 'Disconnected' }}</span>
      </div>
    </div>

    <div class="space-y-6">
      <!-- Discord Bot Setup -->
      <div v-if="!isConnected" class="space-y-4">
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <h3 class="font-medium mb-2">Bot Configuration</h3>
          <div class="space-y-3">
            <div>
              <label class="text-sm text-gray-400">Bot Token</label>
              <input 
                v-model="botToken"
                type="password"
                class="w-full mt-1"
                placeholder="Enter your Discord bot token"
              />
            </div>
            <div>
              <label class="text-sm text-gray-400">Server ID</label>
              <input 
                v-model="serverId"
                type="text"
                class="w-full mt-1"
                placeholder="Enter your Discord server ID"
              />
            </div>
            <button @click="connectDiscord" class="btn btn-primary w-full">
              Connect Discord Bot
            </button>
          </div>
        </div>
      </div>

      <!-- Channel Mappings -->
      <div v-if="isConnected" class="space-y-4">
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <h3 class="font-medium mb-4">Channel Mappings</h3>
          <div class="space-y-3">
            <div v-for="(channel, type) in channels" 
                 :key="type"
                 class="flex items-center justify-between">
              <span class="text-gray-400">{{ type }}</span>
              <select 
                v-model="channel.id"
                class="bg-[#1E293B] border border-gray-700 rounded px-3 py-1"
              >
                <option v-for="ch in availableChannels" 
                        :key="ch.id" 
                        :value="ch.id">
                  {{ ch.name }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Webhook Settings -->
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <h3 class="font-medium mb-4">Event Notifications</h3>
          <div class="space-y-2">
            <div v-for="(enabled, event) in notifications" 
                 :key="event"
                 class="flex items-center justify-between">
              <span class="text-gray-400">{{ formatEventName(event) }}</span>
              <label class="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox"
                  v-model="notifications[event]"
                  class="sr-only peer"
                >
                <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer 
                           peer-checked:after:translate-x-full peer-checked:after:border-white 
                           after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                           after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all
                           peer-checked:bg-[#00D1FF]">
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isConnected = ref(false);
const botToken = ref('');
const serverId = ref('');

const channels = ref({
  'server-status': { id: '', name: 'Server Status' },
  'player-chat': { id: '', name: 'Player Chat' },
  'admin-logs': { id: '', name: 'Admin Logs' }
});

const notifications = ref({
  playerJoin: true,
  playerLeave: true,
  serverStart: true,
  serverStop: true,
  backupComplete: true,
  performanceAlert: true
});

const availableChannels = ref([
  { id: '1', name: '📢-announcements' },
  { id: '2', name: '💬-chat' },
  { id: '3', name: '🤖-bot-logs' }
]);

function connectDiscord() {
  // Simulate connection
  setTimeout(() => {
    isConnected.value = true;
  }, 1500);
}

function formatEventName(event: string): string {
  return event
    .replace(/([A-Z])/g, ' $1')
    .toLowerCase()
    .replace(/^./, str => str.toUpperCase());
}
</script>