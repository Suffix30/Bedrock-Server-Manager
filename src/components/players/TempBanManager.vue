<template>
  <div class="card p-6">
    <h2 class="text-2xl font-bold mb-6 text-[#00D1FF]">Temporary Bans</h2>
    
    <div class="space-y-6">
      <!-- Add Temp Ban -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Add Temporary Ban</h3>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-400 mb-1">Username</label>
              <input 
                v-model="newBan.username"
                type="text"
                class="w-full"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-1">Duration</label>
              <div class="flex space-x-2">
                <input 
                  v-model="newBan.duration"
                  type="number"
                  class="w-24 text-center"
                  min="1"
                />
                <select 
                  v-model="newBan.unit"
                  class="flex-1 bg-[#1E293B] border border-gray-700 rounded-lg px-4"
                >
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                </select>
              </div>
            </div>
          </div>
          
          <div>
            <label class="block text-sm text-gray-400 mb-1">Reason</label>
            <input 
              v-model="newBan.reason"
              type="text"
              class="w-full"
              placeholder="Enter ban reason"
            />
          </div>
          
          <button 
            @click="addTempBan"
            class="btn btn-primary w-full"
            :disabled="!isValidBan"
          >
            Add Ban
          </button>
        </div>
      </div>

      <!-- Active Bans -->
      <div class="space-y-4">
        <h3 class="font-medium text-gray-100">Active Temporary Bans</h3>
        
        <div v-if="activeBans.length === 0" 
             class="text-center text-gray-400 py-8">
          No active temporary bans
        </div>
        
        <div v-else v-for="ban in activeBans" 
             :key="ban.id"
             class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-center space-x-2">
                <span class="text-gray-100 font-medium">{{ ban.username }}</span>
                <span class="text-sm px-2 py-0.5 rounded-full bg-red-900 text-red-400">
                  {{ formatTimeRemaining(ban.expiresAt) }}
                </span>
              </div>
              <div class="text-sm text-gray-400 mt-1">
                {{ ban.reason }}
              </div>
              <div class="text-sm text-gray-500 mt-1">
                Banned by {{ ban.bannedBy }} • Expires {{ formatDate(ban.expiresAt) }}
              </div>
            </div>
            
            <button 
              @click="removeBan(ban.id)"
              class="text-[#00D1FF] hover:text-[#00B8E6]"
            >
              Unban
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { formatDistanceToNow, format } from 'date-fns';

interface TempBan {
  id: string;
  username: string;
  reason: string;
  bannedBy: string;
  bannedAt: Date;
  expiresAt: Date;
}

const newBan = ref({
  username: '',
  duration: 1,
  unit: 'hours',
  reason: ''
});

const activeBans = ref<TempBan[]>([
  {
    id: '1',
    username: 'Griefer123',
    reason: 'Griefing player bases',
    bannedBy: 'Admin',
    bannedAt: new Date(Date.now() - 3600000),
    expiresAt: new Date(Date.now() + 82800000) // 23 hours from now
  }
]);

const isValidBan = computed(() => {
  return newBan.value.username && 
         newBan.value.duration > 0 && 
         newBan.value.reason;
});

function getDurationInMs(duration: number, unit: string): number {
  const multipliers = {
    minutes: 60 * 1000,
    hours: 60 * 60 * 1000,
    days: 24 * 60 * 60 * 1000,
    weeks: 7 * 24 * 60 * 60 * 1000
  };
  return duration * multipliers[unit as keyof typeof multipliers];
}

function addTempBan() {
  if (!isValidBan.value) return;

  const duration = getDurationInMs(newBan.value.duration, newBan.value.unit);
  const now = new Date();

  activeBans.value.push({
    id: Date.now().toString(),
    username: newBan.value.username,
    reason: newBan.value.reason,
    bannedBy: 'Admin', // Replace with actual admin name
    bannedAt: now,
    expiresAt: new Date(now.getTime() + duration)
  });

  // Reset form
  newBan.value = {
    username: '',
    duration: 1,
    unit: 'hours',
    reason: ''
  };
}

function removeBan(id: string) {
  activeBans.value = activeBans.value.filter(ban => ban.id !== id);
}

function formatTimeRemaining(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

function formatDate(date: Date): string {
  return format(date, 'MMM d, yyyy HH:mm');
}

// Auto-remove expired bans
setInterval(() => {
  const now = new Date();
  activeBans.value = activeBans.value.filter(ban => ban.expiresAt > now);
}, 60000); // Check every minute
</script>