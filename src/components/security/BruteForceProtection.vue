<template>
  <div class="card p-6">
    <h2 class="text-2xl font-bold mb-6 text-[#00D1FF]">Brute Force Protection</h2>
    
    <div class="space-y-6">
      <!-- Protection Settings -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Protection Settings</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium text-gray-100">Max Login Attempts</div>
              <div class="text-sm text-gray-400">
                Number of failed attempts before blocking
              </div>
            </div>
            <select v-model="settings.maxAttempts"
                    class="bg-[#1E293B] border border-gray-700 rounded-lg px-4 py-2">
              <option value="3">3 attempts</option>
              <option value="5">5 attempts</option>
              <option value="10">10 attempts</option>
            </select>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium text-gray-100">Block Duration</div>
              <div class="text-sm text-gray-400">
                How long IPs remain blocked
              </div>
            </div>
            <select v-model="settings.blockDuration"
                    class="bg-[#1E293B] border border-gray-700 rounded-lg px-4 py-2">
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
            </select>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium text-gray-100">Attempt Window</div>
              <div class="text-sm text-gray-400">
                Time window for counting attempts
              </div>
            </div>
            <select v-model="settings.attemptWindow"
                    class="bg-[#1E293B] border border-gray-700 rounded-lg px-4 py-2">
              <option value="5">5 minutes</option>
              <option value="10">10 minutes</option>
              <option value="15">15 minutes</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Blocked IPs -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-medium">Blocked IPs</h3>
          <span class="text-sm text-gray-400">
            {{ blockedIPs.length }} IPs blocked
          </span>
        </div>
        
        <div class="space-y-2">
          <div v-if="blockedIPs.length === 0" 
               class="text-center text-gray-400 py-4">
            No blocked IPs
          </div>

          <div v-else v-for="ip in blockedIPs" 
               :key="ip"
               class="flex items-center justify-between py-2">
            <div>
              <span class="font-mono text-red-400">{{ ip }}</span>
              <span class="text-sm text-gray-400 ml-2">
                {{ getFailedAttempts(ip) }} failed attempts
              </span>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-400">
                {{ formatTimeRemaining(getBlockExpiry(ip)) }}
              </span>
              <button @click="unblockIP(ip)"
                      class="text-[#00D1FF] hover:text-[#00B8E6] text-sm">
                Unblock
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Login Attempts -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Recent Login Attempts</h3>
        <div class="space-y-2">
          <div v-for="attempt in recentAttempts" 
               :key="attempt.timestamp.getTime()"
               class="flex items-center justify-between py-2">
            <div>
              <span class="font-mono" :class="attempt.success ? 'text-green-400' : 'text-red-400'">
                {{ attempt.ip }}
              </span>
              <span class="text-sm text-gray-400 ml-2">
                {{ attempt.success ? 'Successful login' : 'Failed attempt' }}
              </span>
            </div>
            <span class="text-sm text-gray-400">
              {{ formatTimeAgo(attempt.timestamp) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { formatDistanceToNow } from 'date-fns';
import { useSecurityStore } from '../../stores/securityStore';

const store = useSecurityStore();

const settings = ref({
  maxAttempts: 5,
  blockDuration: 15,
  attemptWindow: 5
});

const blockedIPs = computed(() => {
  return Array.from(store.blockedIPs.keys());
});

const recentAttempts = computed(() => {
  return store.getRecentAttempts();
});

function getFailedAttempts(ip: string): number {
  return store.getFailedAttempts(ip);
}

function getBlockExpiry(ip: string): Date | undefined {
  return store.blockedIPs.get(ip);
}

function unblockIP(ip: string) {
  store.unblockIP(ip);
}

function formatTimeAgo(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

function formatTimeRemaining(date: Date | undefined): string {
  if (!date) return '';
  return formatDistanceToNow(date, { addSuffix: true });
}
</script>