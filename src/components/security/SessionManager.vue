<template>
  <div class="card p-6">
    <h2 class="text-2xl font-bold mb-6 text-[#00D1FF]">Active Sessions</h2>
    
    <div class="space-y-6">
      <!-- Session List -->
      <div class="space-y-4">
        <div v-for="session in store.getActiveSessions(currentUserId)" 
             :key="session.id"
             class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-center space-x-2">
                <span class="text-gray-100">{{ session.userAgent }}</span>
                <span v-if="isCurrentSession(session.id)"
                      class="px-2 py-0.5 rounded-full text-xs bg-green-900 text-green-400">
                  Current Session
                </span>
              </div>
              <div class="text-sm text-gray-400 mt-1">
                <span>IP: {{ session.ip }}</span>
                <span class="mx-2">•</span>
                <span>Last active: {{ formatTimeAgo(session.lastActive) }}</span>
              </div>
            </div>
            
            <div class="flex items-center space-x-3">
              <button v-if="!isCurrentSession(session.id)"
                      @click="store.terminateSession(session.id)"
                      class="text-red-500 hover:text-red-400">
                Terminate
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Security Settings -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Security Settings</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium text-gray-100">Terminate All Other Sessions</div>
              <div class="text-sm text-gray-400">
                Log out of all sessions except the current one
              </div>
            </div>
            <button @click="terminateOtherSessions" 
                    class="btn btn-secondary">
              Terminate All
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium text-gray-100">Session Timeout</div>
              <div class="text-sm text-gray-400">
                Automatically log out after inactivity
              </div>
            </div>
            <select v-model="timeoutDuration"
                    class="bg-[#1E293B] border border-gray-700 rounded-lg px-4 py-2">
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Login Attempts -->
      <div class="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
        <h3 class="font-medium mb-4">Recent Login Attempts</h3>
        <div class="space-y-2">
          <div v-for="(ip, index) in blockedIPs" 
               :key="index"
               class="flex items-center justify-between py-2">
            <div>
              <span class="font-mono text-red-400">{{ ip }}</span>
              <span class="text-sm text-gray-400 ml-2">
                Blocked for multiple failed attempts
              </span>
            </div>
            <div class="text-sm text-gray-400">
              {{ formatTimeRemaining(getBlockExpiry(ip)) }}
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
import { useSecurityStore } from '../../stores/securityStore';

const store = useSecurityStore();
const currentUserId = 'current-user-id'; // Replace with actual user ID
const currentSessionId = 'current-session-id'; // Replace with actual session ID
const timeoutDuration = ref('30');

const blockedIPs = computed(() => {
  return Array.from(store.blockedIPs.keys());
});

function isCurrentSession(sessionId: string): boolean {
  return sessionId === currentSessionId;
}

function terminateOtherSessions() {
  const sessions = store.getActiveSessions(currentUserId);
  sessions.forEach(session => {
    if (!isCurrentSession(session.id)) {
      store.terminateSession(session.id);
    }
  });
}

function formatTimeAgo(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

function getBlockExpiry(ip: string): Date | undefined {
  return store.blockedIPs.get(ip);
}

function formatTimeRemaining(date: Date | undefined): string {
  if (!date) return '';
  return formatDistanceToNow(date, { addSuffix: true });
}
</script>