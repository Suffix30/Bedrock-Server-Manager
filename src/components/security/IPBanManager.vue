<template>
  <div class="card p-6">
    <h2 class="text-2xl font-bold mb-6 text-[#00D1FF]">IP Ban Management</h2>
    
    <div class="space-y-6">
      <!-- Add IP Ban -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <div class="flex space-x-4">
          <input 
            v-model="newBan.ip"
            type="text"
            placeholder="Enter IP address"
            class="flex-1"
          />
          <input 
            v-model="newBan.reason"
            type="text"
            placeholder="Ban reason"
            class="flex-1"
          />
          <select 
            v-model="newBan.duration"
            class="bg-[#1E293B] border border-gray-700 rounded-lg px-4"
          >
            <option value="1">1 hour</option>
            <option value="24">24 hours</option>
            <option value="168">1 week</option>
            <option value="720">30 days</option>
            <option value="-1">Permanent</option>
          </select>
          <button @click="addBan" class="btn btn-primary">
            Add Ban
          </button>
        </div>
      </div>

      <!-- Banned IPs List -->
      <div class="bg-[#0F172A] rounded-lg border border-gray-800">
        <div class="p-4 border-b border-gray-800">
          <div class="flex justify-between items-center">
            <h3 class="font-medium">Active IP Bans</h3>
            <span class="text-sm text-gray-400">
              {{ activeBans.length }} banned IPs
            </span>
          </div>
        </div>

        <div class="divide-y divide-gray-800">
          <div v-for="ban in activeBans" 
               :key="ban.ip"
               class="p-4 flex items-center justify-between">
            <div>
              <div class="flex items-center space-x-2">
                <span class="font-mono text-red-400">{{ ban.ip }}</span>
                <span v-if="ban.duration === -1"
                      class="px-2 py-0.5 rounded-full text-xs bg-red-900 text-red-400">
                  Permanent
                </span>
              </div>
              <div class="text-sm text-gray-400 mt-1">{{ ban.reason }}</div>
              <div class="text-sm text-gray-500 mt-1">
                Banned by {{ ban.bannedBy }} • 
                {{ ban.duration === -1 ? 'Never expires' : `Expires ${formatDate(ban.expiresAt)}` }}
              </div>
            </div>
            
            <div class="flex items-center space-x-4">
              <button 
                @click="extendBan(ban.ip)"
                class="text-[#00D1FF] hover:text-[#00B8E6]"
              >
                Extend
              </button>
              <button 
                @click="removeBan(ban.ip)"
                class="text-red-500 hover:text-red-400"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Ban History -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Ban History</h3>
        <div class="space-y-2">
          <div v-for="ban in banHistory" 
               :key="`${ban.ip}-${ban.bannedAt}`"
               class="text-sm text-gray-400">
            <span class="font-mono">{{ ban.ip }}</span> was banned for 
            <span class="text-gray-300">{{ ban.reason }}</span>
            <span class="text-gray-500">({{ formatTimeAgo(ban.bannedAt) }})</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { format, formatDistanceToNow } from 'date-fns';

interface IPBan {
  ip: string;
  reason: string;
  duration: number; // hours, -1 for permanent
  bannedBy: string;
  bannedAt: Date;
  expiresAt?: Date;
}

const newBan = ref({
  ip: '',
  reason: '',
  duration: '24'
});

const activeBans = ref<IPBan[]>([
  {
    ip: '192.168.1.100',
    reason: 'Attempted DDoS attack',
    duration: -1,
    bannedBy: 'Admin',
    bannedAt: new Date(Date.now() - 86400000)
  },
  {
    ip: '192.168.1.101',
    reason: 'Multiple failed login attempts',
    duration: 24,
    bannedBy: 'System',
    bannedAt: new Date(Date.now() - 3600000),
    expiresAt: new Date(Date.now() + 82800000)
  }
]);

const banHistory = ref<IPBan[]>([
  {
    ip: '192.168.1.102',
    reason: 'Spam',
    duration: 24,
    bannedBy: 'Moderator',
    bannedAt: new Date(Date.now() - 172800000),
    expiresAt: new Date(Date.now() - 86400000)
  }
]);

function addBan() {
  if (!newBan.value.ip || !newBan.value.reason) return;

  const duration = parseInt(newBan.value.duration);
  const ban: IPBan = {
    ip: newBan.value.ip,
    reason: newBan.value.reason,
    duration,
    bannedBy: 'Admin',
    bannedAt: new Date(),
    expiresAt: duration === -1 ? undefined : new Date(Date.now() + duration * 3600000)
  };

  activeBans.value.push(ban);
  newBan.value = {
    ip: '',
    reason: '',
    duration: '24'
  };
}

function removeBan(ip: string) {
  const ban = activeBans.value.find(b => b.ip === ip);
  if (ban) {
    banHistory.value.push(ban);
    activeBans.value = activeBans.value.filter(b => b.ip !== ip);
  }
}

function extendBan(ip: string) {
  const ban = activeBans.value.find(b => b.ip === ip);
  if (ban && ban.expiresAt) {
    ban.expiresAt = new Date(ban.expiresAt.getTime() + 24 * 3600000);
  }
}

function formatDate(date: Date | undefined): string {
  if (!date) return 'Never';
  return format(date, 'MMM d, yyyy HH:mm');
}

function formatTimeAgo(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}
</script>