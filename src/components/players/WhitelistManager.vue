<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-[#00D1FF]">Whitelist Manager</h2>
      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-400">Whitelist Status:</span>
          <span :class="whitelistEnabled ? 'text-green-400' : 'text-gray-400'">
            {{ whitelistEnabled ? 'Enabled' : 'Disabled' }}
          </span>
        </div>
        <button 
          @click="toggleWhitelist"
          :class="[
            'btn',
            whitelistEnabled ? 'btn-primary' : 'btn-secondary'
          ]"
        >
          {{ whitelistEnabled ? 'Disable' : 'Enable' }} Whitelist
        </button>
      </div>
    </div>

    <div class="space-y-6">
      <!-- Add Player Form -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <div class="flex space-x-4">
          <input 
            v-model="newPlayer"
            type="text"
            placeholder="Enter player username"
            class="flex-1"
            @keyup.enter="addPlayer"
          />
          <button @click="addPlayer" class="btn btn-primary">
            Add Player
          </button>
        </div>
      </div>

      <!-- Whitelisted Players -->
      <div class="bg-[#0F172A] rounded-lg border border-gray-800">
        <div class="p-4 border-b border-gray-800">
          <div class="flex justify-between items-center">
            <h3 class="font-medium">Whitelisted Players</h3>
            <span class="text-sm text-gray-400">
              {{ whitelistedPlayers.length }} players
            </span>
          </div>
        </div>

        <div class="divide-y divide-gray-800">
          <div v-for="player in whitelistedPlayers" 
               :key="player.username"
               class="p-4 flex items-center justify-between">
            <div>
              <div class="flex items-center space-x-2">
                <span class="text-gray-100">{{ player.username }}</span>
                <span v-if="player.online" class="text-xs px-2 py-0.5 rounded-full bg-green-900 text-green-400">
                  Online
                </span>
              </div>
              <div class="text-sm text-gray-400 mt-1">
                Added {{ formatDate(player.addedAt) }}
              </div>
            </div>
            
            <div class="flex items-center space-x-3">
              <span class="text-sm text-gray-400">
                Added by {{ player.addedBy }}
              </span>
              <button 
                @click="removePlayer(player.username)"
                class="text-red-500 hover:text-red-400"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Whitelist Settings -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Settings</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Kick Non-whitelisted</div>
              <div class="text-sm text-gray-400">
                Automatically kick players not on whitelist
              </div>
            </div>
            <button 
              @click="settings.kickNonWhitelisted = !settings.kickNonWhitelisted"
              :class="[
                'btn',
                settings.kickNonWhitelisted ? 'btn-primary' : 'btn-secondary'
              ]"
            >
              {{ settings.kickNonWhitelisted ? 'Enabled' : 'Disabled' }}
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-100">Auto-whitelist OPs</div>
              <div class="text-sm text-gray-400">
                Automatically whitelist server operators
              </div>
            </div>
            <button 
              @click="settings.autoWhitelistOps = !settings.autoWhitelistOps"
              :class="[
                'btn',
                settings.autoWhitelistOps ? 'btn-primary' : 'btn-secondary'
              ]"
            >
              {{ settings.autoWhitelistOps ? 'Enabled' : 'Disabled' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Recent Activity</h3>
        <div class="space-y-2">
          <div v-for="activity in recentActivity" 
               :key="activity.id"
               class="text-sm">
            <span :class="{
              'text-green-400': activity.type === 'add',
              'text-red-400': activity.type === 'remove',
              'text-yellow-400': activity.type === 'toggle'
            }">{{ formatActivityType(activity.type) }}</span>
            <span class="text-gray-400 ml-2">{{ activity.message }}</span>
            <span class="text-gray-500 ml-2">{{ formatTimeAgo(activity.timestamp) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { format, formatDistanceToNow } from 'date-fns';

interface WhitelistedPlayer {
  username: string;
  addedAt: Date;
  addedBy: string;
  online: boolean;
}

interface WhitelistActivity {
  id: string;
  type: 'add' | 'remove' | 'toggle';
  message: string;
  timestamp: Date;
}

const whitelistEnabled = ref(true);
const newPlayer = ref('');

const whitelistedPlayers = ref<WhitelistedPlayer[]>([
  {
    username: 'Player1',
    addedAt: new Date(Date.now() - 86400000),
    addedBy: 'Admin',
    online: true
  },
  {
    username: 'Player2',
    addedAt: new Date(Date.now() - 172800000),
    addedBy: 'Moderator',
    online: false
  }
]);

const settings = ref({
  kickNonWhitelisted: true,
  autoWhitelistOps: true
});

const recentActivity = ref<WhitelistActivity[]>([
  {
    id: '1',
    type: 'add',
    message: 'Added Player1 to whitelist',
    timestamp: new Date(Date.now() - 86400000)
  },
  {
    id: '2',
    type: 'toggle',
    message: 'Enabled whitelist',
    timestamp: new Date(Date.now() - 172800000)
  }
]);

function toggleWhitelist() {
  whitelistEnabled.value = !whitelistEnabled.value;
  recentActivity.value.unshift({
    id: Date.now().toString(),
    type: 'toggle',
    message: `${whitelistEnabled.value ? 'Enabled' : 'Disabled'} whitelist`,
    timestamp: new Date()
  });
}

function addPlayer() {
  if (!newPlayer.value.trim()) return;

  whitelistedPlayers.value.unshift({
    username: newPlayer.value,
    addedAt: new Date(),
    addedBy: 'Admin',
    online: false
  });

  recentActivity.value.unshift({
    id: Date.now().toString(),
    type: 'add',
    message: `Added ${newPlayer.value} to whitelist`,
    timestamp: new Date()
  });

  newPlayer.value = '';
}

function removePlayer(username: string) {
  whitelistedPlayers.value = whitelistedPlayers.value.filter(
    p => p.username !== username
  );

  recentActivity.value.unshift({
    id: Date.now().toString(),
    type: 'remove',
    message: `Removed ${username} from whitelist`,
    timestamp: new Date()
  });
}

function formatDate(date: Date): string {
  return format(date, 'MMM d, yyyy HH:mm');
}

function formatTimeAgo(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

function formatActivityType(type: string): string {
  switch (type) {
    case 'add':
      return 'Added';
    case 'remove':
      return 'Removed';
    case 'toggle':
      return 'Changed';
    default:
      return type;
  }
}
</script>