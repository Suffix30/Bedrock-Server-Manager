<template>
  <div class="space-y-6">
    <!-- IP Ban Management -->
    <div class="card p-6">
      <h2 class="text-2xl font-bold mb-6 text-[#00D1FF]">IP Ban Management</h2>
      
      <div class="space-y-4">
        <!-- Add IP Ban -->
        <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="flex space-x-4">
            <div class="flex-1">
              <input 
                v-model="newBan.ip"
                type="text"
                placeholder="Enter IP address"
                class="w-full"
              />
            </div>
            <div class="flex-1">
              <input 
                v-model="newBan.reason"
                type="text"
                placeholder="Ban reason"
                class="w-full"
              />
            </div>
            <div class="w-48">
              <input 
                v-model="newBan.duration"
                type="number"
                placeholder="Duration (hours)"
                class="w-full"
              />
            </div>
            <button @click="addIpBan" class="btn btn-primary">
              Add Ban
            </button>
          </div>
        </div>

        <!-- IP Ban List -->
        <div class="space-y-2">
          <div v-for="ban in ipBans" 
               :key="ban.ip"
               class="bg-[#0F172A] p-4 rounded-lg border border-gray-800 flex items-center justify-between">
            <div>
              <div class="flex items-center space-x-2">
                <span class="text-gray-100 font-mono">{{ ban.ip }}</span>
                <span class="text-sm text-red-400">{{ ban.active ? 'Active' : 'Expired' }}</span>
              </div>
              <div class="text-sm text-gray-400 mt-1">
                <span>{{ ban.reason }}</span>
                <span class="mx-2">•</span>
                <span>Expires: {{ formatDate(ban.expiresAt) }}</span>
              </div>
            </div>
            <button @click="removeIpBan(ban.ip)" class="text-red-500 hover:text-red-400">
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Whitelist Management -->
    <div class="card p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-[#00D1FF]">Whitelist Management</h2>
        <div class="flex items-center space-x-4">
          <label class="flex items-center space-x-2">
            <input 
              v-model="whitelistEnabled"
              type="checkbox"
              class="rounded border-gray-700"
            />
            <span class="text-sm text-gray-400">Enable Whitelist</span>
          </label>
          <button @click="showAddPlayer = true" class="btn btn-primary">
            Add Player
          </button>
        </div>
      </div>

      <div class="space-y-4">
        <div v-for="player in whitelistedPlayers" 
             :key="player.username"
             class="bg-[#0F172A] p-4 rounded-lg border border-gray-800 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 rounded-full bg-[#2E3B4B] flex items-center justify-center">
              <span class="text-sm font-medium">{{ player.username[0].toUpperCase() }}</span>
            </div>
            <div>
              <span class="text-gray-100">{{ player.username }}</span>
              <span class="text-sm text-gray-400 ml-2">Added {{ formatDate(player.addedAt) }}</span>
            </div>
          </div>
          <button @click="removeFromWhitelist(player.username)" 
                  class="text-red-500 hover:text-red-400">
            Remove
          </button>
        </div>
      </div>
    </div>

    <!-- Permission Groups -->
    <div class="card p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-[#00D1FF]">Permission Groups</h2>
        <button @click="showAddGroup = true" class="btn btn-primary">
          Add Group
        </button>
      </div>

      <div class="space-y-4">
        <div v-for="group in permissionGroups" 
             :key="group.id"
             class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="flex justify-between items-start">
            <div>
              <div class="flex items-center space-x-2">
                <span class="text-gray-100 font-medium">{{ group.name }}</span>
                <span :class="{
                  'bg-red-900 text-red-400': group.name === 'admin',
                  'bg-blue-900 text-blue-400': group.name === 'moderator',
                  'bg-green-900 text-green-400': group.name === 'vip',
                  'bg-gray-900 text-gray-400': group.name === 'default'
                }" class="px-2 py-0.5 rounded text-xs">
                  {{ group.members.length }} members
                </span>
              </div>
              <div class="mt-2 flex flex-wrap gap-2">
                <span v-for="perm in group.permissions" 
                      :key="perm"
                      class="text-xs px-2 py-1 rounded-full bg-[#1E293B] text-gray-400">
                  {{ perm }}
                </span>
              </div>
            </div>
            <div class="flex space-x-2">
              <button @click="editGroup(group)" class="text-[#00D1FF] hover:text-[#00B8E6]">
                Edit
              </button>
              <button v-if="group.name !== 'default'" 
                      @click="deleteGroup(group.id)"
                      class="text-red-500 hover:text-red-400">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { format } from 'date-fns';

// IP Bans
interface IpBan {
  ip: string;
  reason: string;
  expiresAt: Date;
  active: boolean;
}

const ipBans = ref<IpBan[]>([
  {
    ip: '192.168.1.100',
    reason: 'Suspicious activity',
    expiresAt: new Date(Date.now() + 86400000),
    active: true
  }
]);

const newBan = ref({
  ip: '',
  reason: '',
  duration: 24
});

// Whitelist
const whitelistEnabled = ref(true);
const whitelistedPlayers = ref([
  {
    username: 'Steve',
    addedAt: new Date(Date.now() - 86400000)
  }
]);

// Permission Groups
interface PermissionGroup {
  id: string;
  name: string;
  permissions: string[];
  members: string[];
}

const permissionGroups = ref<PermissionGroup[]>([
  {
    id: '1',
    name: 'admin',
    permissions: ['*'],
    members: ['admin1']
  },
  {
    id: '2',
    name: 'moderator',
    permissions: ['kick', 'ban', 'mute'],
    members: ['mod1', 'mod2']
  },
  {
    id: '3',
    name: 'vip',
    permissions: ['color_chat', 'fly'],
    members: ['vip1']
  },
  {
    id: '4',
    name: 'default',
    permissions: ['chat', 'play'],
    members: ['player1', 'player2']
  }
]);

// Modal states
const showAddPlayer = ref(false);
const showAddGroup = ref(false);

// Functions
function addIpBan() {
  if (newBan.value.ip && newBan.value.reason) {
    ipBans.value.push({
      ip: newBan.value.ip,
      reason: newBan.value.reason,
      expiresAt: new Date(Date.now() + newBan.value.duration * 3600000),
      active: true
    });
    newBan.value = { ip: '', reason: '', duration: 24 };
  }
}

function removeIpBan(ip: string) {
  ipBans.value = ipBans.value.filter(ban => ban.ip !== ip);
}

function removeFromWhitelist(username: string) {
  whitelistedPlayers.value = whitelistedPlayers.value.filter(p => p.username !== username);
}

function editGroup(group: PermissionGroup) {
  // Implement group editing
}

function deleteGroup(id: string) {
  permissionGroups.value = permissionGroups.value.filter(g => g.id !== id);
}

function formatDate(date: Date): string {
  return format(date, 'MMM d, yyyy HH:mm');
}
</script>